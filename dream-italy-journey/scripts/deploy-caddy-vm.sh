#!/usr/bin/env bash

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-hostings-488811}"
INSTANCE="${INSTANCE:-caddy-server}"
ZONE="${ZONE:-us-central1-c}"
SITE_SLUG="${SITE_SLUG:-gostudyoverseas}"
CADDY_HOSTNAME="${CADDY_HOSTNAME:-gostudyoverseas.in}"
CADDY_WWW_HOSTNAME="${CADDY_WWW_HOSTNAME:-www.gostudyoverseas.in}"
CADDYFILE="${CADDYFILE:-/etc/caddy/Caddyfile}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
COMMIT_PREFIX="${COMMIT_PREFIX:-deploy}"
COMMIT_TIME_ZONE="${COMMIT_TIME_ZONE:-Asia/Kolkata}"
REMOTE_USER="${REMOTE_USER:-$(id -un)}"

REMOTE_SITE_BASE="${REMOTE_SITE_BASE:-/srv/www/${SITE_SLUG}}"
REMOTE_REPO_DIR="${REMOTE_REPO_DIR:-${REMOTE_SITE_BASE}/repo}"
REMOTE_RELEASES_BASE="${REMOTE_RELEASES_BASE:-${REMOTE_SITE_BASE}/releases}"
REMOTE_CURRENT_LINK="${REMOTE_CURRENT_LINK:-${REMOTE_SITE_BASE}/current}"
REMOTE_SHARED_DIR="${REMOTE_SHARED_DIR:-${REMOTE_SITE_BASE}/shared}"
REMOTE_SHARED_IMAGES_DIR="${REMOTE_SHARED_IMAGES_DIR:-${REMOTE_SHARED_DIR}/public-images}"
USE_IAP_TUNNEL="${USE_IAP_TUNNEL:-true}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_IMAGES_DIR="${ROOT_DIR}/public/images"

GCLOUD_SSH_ARGS=(
  --project "$PROJECT_ID"
  --zone "$ZONE"
)

if [[ "$USE_IAP_TUNNEL" == "true" || "$USE_IAP_TUNNEL" == "1" || "$USE_IAP_TUNNEL" == "yes" ]]; then
  GCLOUD_SSH_ARGS+=(--tunnel-through-iap)
fi
BRANCH="${BRANCH:-$(git -C "$ROOT_DIR" branch --show-current)}"
REPO_PUBLIC_URL="${REPO_PUBLIC_URL:-$(git -C "$ROOT_DIR" remote get-url origin)}"
GITHUB_ENV_FILE="${GITHUB_ENV_FILE:-${ROOT_DIR}/../programmatic-meta-ads/.env}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required but not found in PATH." >&2
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required but not found in PATH." >&2
  exit 1
fi

if [[ -z "$BRANCH" ]]; then
  echo "Unable to determine the current git branch." >&2
  exit 1
fi

next_commit_number() {
  local last_number

  last_number="$(
    git -C "$ROOT_DIR" log --format=%s \
      | grep -E "^${COMMIT_PREFIX} [0-9]{3,} - " \
      | sed -E "s/^${COMMIT_PREFIX} ([0-9]{3,}) - .*/\1/" \
      | sort -n \
      | tail -n 1 \
      || true
  )"

  if [[ -z "$last_number" ]]; then
    printf '001'
    return
  fi

  printf '%03d' "$((10#$last_number + 1))"
}

build_commit_message() {
  local sequence
  local timestamp

  sequence="$(next_commit_number)"
  timestamp="$(TZ="$COMMIT_TIME_ZONE" date '+%Y-%m-%d %H:%M:%S %Z')"
  printf '%s %s - %s' "$COMMIT_PREFIX" "$sequence" "$timestamp"
}

load_env_value() {
  local key="$1"
  local file="$2"
  if [[ ! -f "$file" ]]; then
    return 1
  fi

  python3 - "$key" "$file" <<'PY'
import sys
from pathlib import Path

key = sys.argv[1]
path = Path(sys.argv[2])

for raw_line in path.read_text().splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    current_key, value = line.split("=", 1)
    if current_key != key:
        continue
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        value = value[1:-1]
    print(value)
    break
PY
}

load_git_credential_field() {
  local field="$1"
  local repo_url="$2"

  python3 - "$field" "$repo_url" <<'PY'
import subprocess
import sys
from urllib.parse import urlparse

field = sys.argv[1]
repo_url = sys.argv[2]
parsed = urlparse(repo_url)

payload = [
    f"protocol={parsed.scheme}",
    f"host={parsed.hostname or ''}",
]
path = parsed.path.lstrip("/")
if path:
    payload.append(f"path={path}")
if parsed.username:
    payload.append(f"username={parsed.username}")
payload.append("")
payload.append("")

result = subprocess.run(
    ["git", "credential", "fill"],
    input="\n".join(payload),
    text=True,
    capture_output=True,
    check=False,
)

if result.returncode != 0:
    sys.exit(0)

values = {}
for line in result.stdout.splitlines():
    if "=" not in line:
        continue
    key, value = line.split("=", 1)
    values[key] = value

print(values.get(field, ""))
PY
}

shell_quote() {
  python3 -c 'import shlex, sys; print(shlex.quote(sys.argv[1]))' "$1"
}

if [[ -z "${GITHUB_USERNAME:-}" ]]; then
  GITHUB_USERNAME="$(load_git_credential_field "username" "$REPO_PUBLIC_URL" || true)"
fi

if [[ -z "${GITHUB_PASSWORD:-}" ]]; then
  GITHUB_PASSWORD="$(load_git_credential_field "password" "$REPO_PUBLIC_URL" || true)"
fi

if [[ -z "${GITHUB_USERNAME:-}" ]]; then
  GITHUB_USERNAME="$(load_env_value "GITHUB_USERNAME" "$GITHUB_ENV_FILE" || true)"
fi

if [[ -z "${GITHUB_PASSWORD:-}" ]]; then
  GITHUB_PASSWORD="$(load_env_value "GITHUB_PASSWORD" "$GITHUB_ENV_FILE" || true)"
fi

if [[ -z "${GITHUB_USERNAME:-}" || -z "${GITHUB_PASSWORD:-}" ]]; then
  echo "GitHub credentials are required. Set GITHUB_USERNAME/GITHUB_PASSWORD or populate ${GITHUB_ENV_FILE}." >&2
  exit 1
fi

BLOG_ENV_FILE="${BLOG_ENV_FILE:-${ROOT_DIR}/.env.local}"
BLOG_SYNC_SPREADSHEET_ID="${VITE_UNIVERSITY_SHEET_SPREADSHEET_ID:-$(load_env_value "VITE_UNIVERSITY_SHEET_SPREADSHEET_ID" "$BLOG_ENV_FILE" || true)}"
BLOG_SYNC_CLIENT_EMAIL="${VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL:-$(load_env_value "VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL" "$BLOG_ENV_FILE" || true)}"
BLOG_SYNC_PRIVATE_KEY="${VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:-$(load_env_value "VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY" "$BLOG_ENV_FILE" || true)}"
BLOG_SYNC_SHEET_NAME="${VITE_BLOG_SHEET_NAME:-$(load_env_value "VITE_BLOG_SHEET_NAME" "$BLOG_ENV_FILE" || true)}"
EVENT_SYNC_SHEET_NAME="${VITE_EVENT_SHEET_NAME:-$(load_env_value "VITE_EVENT_SHEET_NAME" "$BLOG_ENV_FILE" || true)}"

echo "Refreshing generated blog cache from Google Sheets"
npm run sync:blogs
echo "Refreshing generated event cache from Google Sheets"
npm run sync:events

echo "Preparing commit in ${ROOT_DIR}"

if [[ -n "$(git -C "$ROOT_DIR" status --short)" ]]; then
  COMMIT_MESSAGE="${COMMIT_MESSAGE:-$(build_commit_message)}"
  echo "Committing changes as: ${COMMIT_MESSAGE}"
  git -C "$ROOT_DIR" add -A
  git -C "$ROOT_DIR" commit -m "$COMMIT_MESSAGE"
else
  echo "No local changes to commit; deploying current HEAD"
fi

if [[ -z "${DEPLOY_ID:-}" ]]; then
  SHORT_SHA="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || printf 'local')"
  DEPLOY_ID="$(date -u +%Y%m%d%H%M%S)-${SHORT_SHA}"
fi

REMOTE_RELEASE_DIR="${REMOTE_RELEASE_DIR:-${REMOTE_RELEASES_BASE}/${DEPLOY_ID}}"

urlencode() {
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' "$1"
}

if [[ "$REPO_PUBLIC_URL" != https://*github.com/* ]]; then
  echo "Expected an HTTPS GitHub origin URL, got: ${REPO_PUBLIC_URL}" >&2
  exit 1
fi

REPO_HOST_AND_PATH="${REPO_PUBLIC_URL#https://}"
REPO_HOST_AND_PATH="${REPO_HOST_AND_PATH#*@}"
REPO_AUTH_URL="https://$(urlencode "$GITHUB_USERNAME"):$(urlencode "$GITHUB_PASSWORD")@${REPO_HOST_AND_PATH}"
DEPLOY_COMMIT="$(git -C "$ROOT_DIR" rev-parse HEAD)"

echo "Pushing ${BRANCH} to origin"
git -C "$ROOT_DIR" push origin "$BRANCH"

echo "Preparing remote directories on ${INSTANCE}"
gcloud compute ssh \
  "${GCLOUD_SSH_ARGS[@]}" \
  "$INSTANCE" \
  --command "sudo SITE_BASE='${REMOTE_SITE_BASE}' REPO_DIR='${REMOTE_REPO_DIR}' RELEASES_BASE='${REMOTE_RELEASES_BASE}' SHARED_DIR='${REMOTE_SHARED_DIR}' SHARED_IMAGES_DIR='${REMOTE_SHARED_IMAGES_DIR}' bash -s" <<'REMOTE_PREP'
set -euo pipefail
install -d -m 0755 "$SITE_BASE" "$REPO_DIR" "$RELEASES_BASE" "$SHARED_DIR" "$SHARED_IMAGES_DIR"
REMOTE_PREP

if [[ -d "$PUBLIC_IMAGES_DIR" ]]; then
  echo "Syncing shared public images to ${INSTANCE}:${REMOTE_SHARED_IMAGES_DIR}"

  IAP_USER="$REMOTE_USER"

  TUNNEL_PORT=""
  for port in 62222 62223 62224 62225 62226; do
    if ! (command -v lsof >/dev/null && lsof -i ":$port" >/dev/null 2>&1) || ! (command -v ss >/dev/null && ss -Hln "sport = :$port" 2>/dev/null | grep -q .); then
      TUNNEL_PORT="$port"
      break
    fi
  done

  if [[ -z "$TUNNEL_PORT" ]]; then
    echo "Could not find a free local port for IAP tunnel" >&2
    exit 1
  fi

  TUNNEL_LOG="$(mktemp)"
  gcloud compute start-iap-tunnel \
    --project "$PROJECT_ID" \
    --zone "$ZONE" \
    "$INSTANCE" 22 \
    --local-host-port="localhost:${TUNNEL_PORT}" >"$TUNNEL_LOG" 2>&1 &
  TUNNEL_PID=$!

  cleanup_tunnel() {
    rm -f "$TUNNEL_LOG"
    if kill -0 "$TUNNEL_PID" 2>/dev/null; then
      kill "$TUNNEL_PID" 2>/dev/null || true
      wait "$TUNNEL_PID" 2>/dev/null || true
    fi
  }
  trap cleanup_tunnel EXIT

  # Wait for tunnel readiness
  for _ in $(seq 1 30); do
    if command -v nc >/dev/null && nc -z localhost "$TUNNEL_PORT" 2>/dev/null; then
      break
    fi
    if grep -q "Listening on port" "$TUNNEL_LOG" 2>/dev/null; then
      break
    fi
    sleep 0.5
  done

  if ! nc -z localhost "$TUNNEL_PORT" 2>/dev/null; then
    echo "IAP tunnel failed to start. Log:" >&2
    cat "$TUNNEL_LOG" >&2
    exit 1
  fi

  SSH_KEY="${HOME}/.ssh/google_compute_engine"
  rsync     -az     --delete     --stats     --exclude='.DS_Store'     --rsync-path="sudo rsync"     -e "ssh -p "${TUNNEL_PORT}" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentitiesOnly=yes -i "${SSH_KEY}""     "$PUBLIC_IMAGES_DIR/"     "${IAP_USER}@localhost:${REMOTE_SHARED_IMAGES_DIR}/"
else
  echo "Skipping shared image sync because ${PUBLIC_IMAGES_DIR} does not exist"
fi

if [[ -n "${BLOG_SYNC_SPREADSHEET_ID:-}" && -n "${BLOG_SYNC_CLIENT_EMAIL:-}" && -n "${BLOG_SYNC_PRIVATE_KEY:-}" ]]; then
  BLOG_SYNC_PRIVATE_KEY_B64="$(printf '%s' "$BLOG_SYNC_PRIVATE_KEY" | base64 | tr -d '\n')"
  BLOG_SYNC_SHEET_NAME="${BLOG_SYNC_SHEET_NAME:-Blogs}"
  EVENT_SYNC_SHEET_NAME="${EVENT_SYNC_SHEET_NAME:-Events}"

  echo "Installing VM cron for sheet cache sync on ${INSTANCE}"
  gcloud compute ssh \
    "${GCLOUD_SSH_ARGS[@]}" \
    "$INSTANCE" \
    --command "sudo BLOG_SYNC_SPREADSHEET_ID=$(shell_quote "$BLOG_SYNC_SPREADSHEET_ID") BLOG_SYNC_CLIENT_EMAIL=$(shell_quote "$BLOG_SYNC_CLIENT_EMAIL") BLOG_SYNC_PRIVATE_KEY_B64=$(shell_quote "$BLOG_SYNC_PRIVATE_KEY_B64") BLOG_SYNC_SHEET_NAME=$(shell_quote "$BLOG_SYNC_SHEET_NAME") EVENT_SYNC_SHEET_NAME=$(shell_quote "$EVENT_SYNC_SHEET_NAME") SITE_BASE='${REMOTE_SITE_BASE}' REPO_DIR='${REMOTE_REPO_DIR}' CURRENT_LINK='${REMOTE_CURRENT_LINK}' SHARED_DIR='${REMOTE_SHARED_DIR}' bash -s" <<'REMOTE_BLOG_CRON'
set -euo pipefail

BLOG_SYNC_ENV_FILE="$SHARED_DIR/blog-sync.env"
BLOG_SYNC_LOG_FILE="$SHARED_DIR/blog-sync.log"
BLOG_SYNC_SCRIPT="$SHARED_DIR/bin/sync-blog-cache.sh"
export BLOG_SYNC_ENV_FILE BLOG_SYNC_LOG_FILE BLOG_SYNC_SCRIPT

install -d -m 0755 "$SHARED_DIR" "$SHARED_DIR/bin"

python3 - <<'PY'
import base64
import os
from pathlib import Path
from shlex import quote

env_file = Path(os.environ["BLOG_SYNC_ENV_FILE"])
private_key = base64.b64decode(os.environ["BLOG_SYNC_PRIVATE_KEY_B64"]).decode()
blog_sheet_name = os.environ.get("BLOG_SYNC_SHEET_NAME", "Blogs")
event_sheet_name = os.environ.get("EVENT_SYNC_SHEET_NAME", "Events")

lines = [
    f"VITE_UNIVERSITY_SHEET_SPREADSHEET_ID={quote(os.environ['BLOG_SYNC_SPREADSHEET_ID'])}",
    f"VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL={quote(os.environ['BLOG_SYNC_CLIENT_EMAIL'])}",
    f"VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY={quote(private_key)}",
    f"VITE_BLOG_SHEET_NAME={quote(blog_sheet_name)}",
    f"VITE_EVENT_SHEET_NAME={quote(event_sheet_name)}",
]
env_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
PY

cat > "$BLOG_SYNC_SCRIPT" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

BLOG_SYNC_ENV_FILE="${BLOG_SYNC_ENV_FILE:-/srv/www/gostudyoverseas/shared/blog-sync.env}"
BLOG_SYNC_OUTPUT_PATH="${BLOG_SYNC_OUTPUT_PATH:-}"
BLOG_SYNC_REPO_DIR="${BLOG_SYNC_REPO_DIR:-/srv/www/gostudyoverseas/repo}"

if [[ ! -f "$BLOG_SYNC_ENV_FILE" ]]; then
  echo "Missing blog sync env file: $BLOG_SYNC_ENV_FILE" >&2
  exit 1
fi

if [[ -z "$BLOG_SYNC_OUTPUT_PATH" ]]; then
  echo "Missing BLOG_SYNC_OUTPUT_PATH" >&2
  exit 1
fi

set -a
. "$BLOG_SYNC_ENV_FILE"
set +a

NODE_BIN="${NODE_BIN:-$(command -v node)}"
if [[ -z "$NODE_BIN" ]]; then
  echo "node is required but not found in PATH" >&2
  exit 1
fi

BLOG_SYNC_OUTPUT_PATH="$BLOG_SYNC_OUTPUT_PATH" "$NODE_BIN" "$BLOG_SYNC_REPO_DIR/scripts/sync-blog-sheet.mjs"
EVENT_SYNC_OUTPUT_PATH="${BLOG_SYNC_OUTPUT_PATH%/blogs.json}/events.json" "$NODE_BIN" "$BLOG_SYNC_REPO_DIR/scripts/sync-event-sheet.mjs"
EOF

chmod 0755 "$BLOG_SYNC_SCRIPT"

cat > /etc/cron.d/gostudyoverseas-sheet-cache <<EOF
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
17 * * * * root BLOG_SYNC_OUTPUT_PATH=$CURRENT_LINK/data/blogs.json BLOG_SYNC_ENV_FILE=$BLOG_SYNC_ENV_FILE BLOG_SYNC_REPO_DIR=$REPO_DIR "$BLOG_SYNC_SCRIPT" >> "$BLOG_SYNC_LOG_FILE" 2>&1
EOF

rm -f /etc/cron.d/gostudyoverseas-blog-cache
chmod 0644 /etc/cron.d/gostudyoverseas-sheet-cache
REMOTE_BLOG_CRON
else
  echo "Skipping VM sheet cron install because sheet credentials are missing."
fi

echo "Building and activating release ${DEPLOY_ID} on ${INSTANCE}"
gcloud compute ssh \
  "${GCLOUD_SSH_ARGS[@]}" \
  "$INSTANCE" \
  --command "sudo SITE_BASE='${REMOTE_SITE_BASE}' REPO_DIR='${REMOTE_REPO_DIR}' RELEASE_DIR='${REMOTE_RELEASE_DIR}' RELEASES_BASE='${REMOTE_RELEASES_BASE}' CURRENT_LINK='${REMOTE_CURRENT_LINK}' SHARED_IMAGES_DIR='${REMOTE_SHARED_IMAGES_DIR}' CADDYFILE='${CADDYFILE}' CADDY_HOSTNAME='${CADDY_HOSTNAME}' CADDY_WWW_HOSTNAME='${CADDY_WWW_HOSTNAME}' REPO_PUBLIC_URL='${REPO_PUBLIC_URL}' REPO_AUTH_URL='${REPO_AUTH_URL}' BRANCH='${BRANCH}' DEPLOY_COMMIT='${DEPLOY_COMMIT}' KEEP_RELEASES='${KEEP_RELEASES}' bash -s" <<'REMOTE_SCRIPT'
set -euo pipefail

BACKUP="/etc/caddy/Caddyfile.bak.$(date -u +%Y%m%d%H%M%S)"

if [[ ! -d "$REPO_DIR/.git" ]]; then
  rm -rf "$REPO_DIR"
  git clone "$REPO_AUTH_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"
git remote set-url origin "$REPO_AUTH_URL"
git fetch --prune origin
git checkout --force "$BRANCH"
git reset --hard "$DEPLOY_COMMIT"
git clean -fd
git remote set-url origin "$REPO_PUBLIC_URL"

install -d -m 0755 "$REPO_DIR/public"
if [[ -d "$SHARED_IMAGES_DIR" ]]; then
  rm -rf "$REPO_DIR/public/images"
  ln -sfn "$SHARED_IMAGES_DIR" "$REPO_DIR/public/images"
fi

npm ci
npm run build

if [[ -L "$CURRENT_LINK" ]] && [[ -d "$(readlink -f "$CURRENT_LINK")" ]]; then
  install -d -m 0755 "$RELEASE_DIR"
  cp -al "$(readlink -f "$CURRENT_LINK")"/. "$RELEASE_DIR"/
else
  install -d -m 0755 "$RELEASE_DIR"
fi

rsync -a --delete "$REPO_DIR/dist/" "$RELEASE_DIR/"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

cp "$CADDYFILE" "$BACKUP"

python3 - <<'PY'
import os
from pathlib import Path

path = Path(os.environ["CADDYFILE"])
text = path.read_text()
caddy_hostname = os.environ["CADDY_HOSTNAME"]
caddy_www_hostname = os.environ["CADDY_WWW_HOSTNAME"]
current_link = os.environ["CURRENT_LINK"]
hosts = f"{caddy_hostname}, {caddy_www_hostname}"

if caddy_hostname not in text and caddy_www_hostname not in text:
    block = f"""{hosts} {{
  root * {current_link}
  encode zstd gzip
  try_files {{path}} /index.html
  file_server
}}
"""
    marker = "\n:80 {"
    idx = text.find(marker)
    if idx == -1:
        text = text.rstrip() + "\n\n" + block
    else:
        text = text[:idx] + "\n" + block + "\n" + text[idx + 1:]
    path.write_text(text)
PY

caddy fmt --overwrite "$CADDYFILE" >/dev/null
caddy validate --config "$CADDYFILE" --adapter caddyfile
caddy reload --config "$CADDYFILE" --adapter caddyfile

find "$RELEASES_BASE" -mindepth 1 -maxdepth 1 -type d | sort | head -n "-${KEEP_RELEASES}" 2>/dev/null | xargs -r rm -rf

curl -I --max-time 10 -H "Host: ${CADDY_HOSTNAME}" http://127.0.0.1/ | sed -n '1,8p' || true
curl -I --max-time 10 -H "Host: ${CADDY_WWW_HOSTNAME}" http://127.0.0.1/ | sed -n '1,8p' || true
REMOTE_SCRIPT

echo "Deployment finished:"
echo "  branch: ${BRANCH}"
echo "  commit: ${DEPLOY_COMMIT}"
echo "  hosts: ${CADDY_HOSTNAME}, ${CADDY_WWW_HOSTNAME}"
echo "  release: ${REMOTE_RELEASE_DIR}"
