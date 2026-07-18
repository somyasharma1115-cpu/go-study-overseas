const LEAD_SHEET_NAME = "Lead Submissions";
const BLOG_SHEET_NAME = "Blogs";
const EVENT_SHEET_NAME = "Events";

const CACHE_SECONDS = 300;

const LEAD_HEADERS = [
  "Timestamp",
  "Form",
  "Submitted At",
  "Source Path",
  "Page URL",
  "Referrer",
  "User Agent",
  "Name",
  "Phone",
  "Email",
  "Degree",
  "Countries",
  "Intakes",
  "Levels",
  "Streams",
  "Tests",
  "Budget",
  "Payload JSON",
];

const EVENT_CATEGORIES = ["Live", "Admission Day", "University Fair", "Webinar"];

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || "status").toLowerCase();

    if (action === "blogs") {
      return cachedJsonResponse_("blogs", function () {
        return {
          ok: true,
          action: "blogs",
          data: getBlogEntries_(),
        };
      });
    }

    if (action === "events") {
      return cachedJsonResponse_("events", function () {
        return {
          ok: true,
          action: "events",
          data: getEventEntries_(),
        };
      });
    }

    return jsonResponse_({
      ok: true,
      service: "go-study-overseas-web-app",
      status: "ready",
      actions: ["status", "blogs", "events"],
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_(
      {
        ok: false,
        error: error && error.message ? error.message : String(error),
      },
      400,
    );
  }
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = getLeadSheet_();
    const row = buildLeadRow_(payload);
    sheet.appendRow(row);

    return jsonResponse_({
      ok: true,
      appendedRow: sheet.getLastRow(),
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_(
      {
        ok: false,
        error: error && error.message ? error.message : String(error),
      },
      400,
    );
  }
}

function getWebAppStatus() {
  return {
    enabled: ScriptApp.getService().isEnabled(),
    url: ScriptApp.getService().getUrl(),
  };
}

function clearContentCache() {
  CacheService.getScriptCache().removeAll(["blogs", "events"]);
}

function cachedJsonResponse_(key, producer) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(key);

  if (cached) {
    return jsonResponse_(JSON.parse(cached));
  }

  const payload = producer();
  cache.put(key, JSON.stringify(payload), CACHE_SECONDS);
  return jsonResponse_(payload);
}

function getBlogEntries_() {
  const rows = getSheetRows_(BLOG_SHEET_NAME);
  if (rows.length <= 1) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader_);

  return rows
    .slice(1)
    .map(function (row, index) {
      const record = rowToRecord_(headers, row);
      const headline = getValue_(record.headline).trim();
      const content = getValue_(record.content).trim();

      if (!headline || !content) {
        return null;
      }

      const blogNumber = parseInteger_(record.blog);
      const fallbackSlug = slugify_(headline) || "entry-" + (index + 1);
      const slug = blogNumber ? "blog-" + blogNumber + "-" + fallbackSlug : fallbackSlug;

      return {
        id: slug,
        slug: slug,
        href: "/blog/" + slug,
        blogNumber: blogNumber || undefined,
        headline: headline,
        content: content,
      };
    })
    .filter(Boolean)
    .sort(function (left, right) {
      return (right.blogNumber || -Infinity) - (left.blogNumber || -Infinity);
    });
}

function getEventEntries_() {
  const rows = getSheetRows_(EVENT_SHEET_NAME);
  if (rows.length <= 1) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader_);

  return rows
    .slice(1)
    .map(function (row, index) {
      const record = rowToRecord_(headers, row);

      if (isInactive_(record.active)) {
        return null;
      }

      const title = getValue_(record.title).trim();
      const date = getValue_(record.date).trim();
      const time = getValue_(record.time).trim();
      const location = getValue_(record.location).trim();
      const description = getValue_(record.description).trim();

      if (!title || !date || !time || !location || !description) {
        return null;
      }

      const eventNumber = parseInteger_(record.event);
      const fallbackSlug = slugify_(title) || "event-" + (index + 1);
      const id = eventNumber ? "event-" + eventNumber + "-" + fallbackSlug : fallbackSlug;
      const image = getValue_(record.image || record.imageurl).trim();
      const cta = getValue_(record.cta).trim() || "Register now";

      return {
        id: id,
        eventNumber: eventNumber || undefined,
        category: parseCategory_(record.category),
        title: title,
        date: date,
        time: time,
        location: location,
        description: description,
        image: image || undefined,
        cta: cta,
      };
    })
    .filter(Boolean)
    .sort(function (left, right) {
      return (left.eventNumber || Infinity) - (right.eventNumber || Infinity);
    });
}

function getSheetRows_(sheetName) {
  const spreadsheet = getContentSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Missing sheet tab: " + sheetName);
  }

  return sheet.getDataRange().getDisplayValues();
}

function getContentSpreadsheet_() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) {
    return activeSpreadsheet;
  }

  throw new Error("Missing active spreadsheet. Open the Google Sheet, then use Extensions > Apps Script.");
}

function rowToRecord_(headers, row) {
  const record = {};

  headers.forEach(function (header, index) {
    if (!header) {
      return;
    }

    record[header] = getValue_(row[index]);
  });

  return record;
}

function normalizeHeader_(value) {
  return getValue_(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function slugify_(value) {
  return getValue_(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseInteger_(value) {
  const number = parseInt(getValue_(value).trim(), 10);
  return isFinite(number) ? number : undefined;
}

function parseCategory_(value) {
  const normalizedValue = getValue_(value).trim().toLowerCase();
  const matched = EVENT_CATEGORIES.find(function (category) {
    return category.toLowerCase() === normalizedValue;
  });

  return matched || "Live";
}

function isInactive_(value) {
  const normalizedValue = getValue_(value).trim().toLowerCase();
  return ["false", "no", "0", "inactive", "hidden"].indexOf(normalizedValue) >= 0;
}

function parsePayload_(e) {
  if (!e) {
    throw new Error("Missing event payload");
  }

  const rawPayload =
    (e.parameter && e.parameter.payload) ||
    (e.postData && e.postData.contents) ||
    "";

  if (!rawPayload) {
    throw new Error("Missing submission payload");
  }

  const parsed = JSON.parse(rawPayload);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Submission payload must be an object");
  }

  return parsed;
}

function getLeadSheet_() {
  const spreadsheet = getContentSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(LEAD_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(LEAD_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_HEADERS);
  }

  return sheet;
}

function buildLeadRow_(payload) {
  return [
    new Date(),
    getValue_(payload.form),
    getValue_(payload.submittedAt),
    getValue_(payload.sourcePath),
    getValue_(payload.pageUrl),
    getValue_(payload.referrer),
    getValue_(payload.userAgent),
    getValue_(payload.name),
    getValue_(payload.phone),
    getValue_(payload.email),
    getValue_(payload.degree),
    serializeList_(payload.countries),
    serializeList_(payload.intakes),
    serializeList_(payload.levels),
    serializeList_(payload.streams),
    serializeList_(payload.tests),
    getValue_(payload.budget),
    JSON.stringify(payload),
  ];
}

function serializeList_(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.filter(Boolean).join(", ");
}

function getValue_(value) {
  return value == null ? "" : String(value);
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
