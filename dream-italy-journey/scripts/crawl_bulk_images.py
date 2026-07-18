import json
import re
from pathlib import Path

from icrawler.builtin import BingImageCrawler


ROOT = Path(__file__).resolve().parent.parent
COUNTRIES_JSON = ROOT / "src" / "data" / "countries.json"
OUT_ROOT = ROOT / "public" / "images" / "library"


def slugify(value: str) -> str:
    value = value.lower().replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def crawl(query: str, out_dir: Path, max_num: int) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    crawler = BingImageCrawler(
        downloader_threads=8,
        storage={"root_dir": str(out_dir)},
        log_level="ERROR",
    )
    crawler.crawl(keyword=query, max_num=max_num, min_size=(1200, 700))


def main() -> None:
    countries = json.loads(COUNTRIES_JSON.read_text(encoding="utf-8"))
    (OUT_ROOT / "countries").mkdir(parents=True, exist_ok=True)
    (OUT_ROOT / "universities").mkdir(parents=True, exist_ok=True)
    (OUT_ROOT / "common").mkdir(parents=True, exist_ok=True)

    common_queries = [
        ("students-group", "international students campus life"),
        ("visa-main", "student visa passport airport"),
        ("study-desk", "study abroad desk laptop books"),
    ]
    for slug, query in common_queries:
        crawl(query, OUT_ROOT / "common" / slug, max_num=18)

    for country in countries:
        country_slug = country["slug"]
        country_name = country["name"]
        country_dir = OUT_ROOT / "countries" / country_slug
        country_queries = [
            f"{country_name} university campus",
            f"{country_name} city skyline",
            f"{country_name} students campus life",
            f"{country_name} iconic architecture",
        ]
        for i, query in enumerate(country_queries, start=1):
            crawl(query, country_dir / f"set-{i:02d}", max_num=20)

        uni_base = OUT_ROOT / "universities" / country_slug
        for university in country["universities"]:
            uni_name = university["name"]
            uni_slug = slugify(uni_name)
            query = f"{uni_name} campus {country_name}"
            crawl(query, uni_base / uni_slug, max_num=12)

    manifest = {"generatedBy": "crawl_bulk_images.py"}
    (OUT_ROOT / "manifest-crawler.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("Bulk crawling complete")


if __name__ == "__main__":
    main()
