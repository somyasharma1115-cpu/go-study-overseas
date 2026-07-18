import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const countriesPath = path.join(rootDir, "src/data/countries.json");
const outputRoot = path.join(rootDir, "public/images/library");

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const readCountries = async () => {
  const raw = await fs.readFile(countriesPath, "utf8");
  return JSON.parse(raw);
};

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options = {}, attempts = 5) => {
  let waitMs = 1200;
  for (let i = 0; i < attempts; i += 1) {
    const response = await fetch(url, options);
    if (response.status !== 429) return response;
    if (i < attempts - 1) {
      await sleep(waitMs);
      waitMs *= 2;
    }
  }
  return fetch(url, options);
};

const downloadImage = async (url, destination) => {
  const response = await fetchWithRetry(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 Image Collector",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status} for ${url}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Unexpected content type ${contentType} for ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(destination, Buffer.from(arrayBuffer));
};

const buildCommonsSearchUrl = (query) => {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|mime",
    iiurlwidth: "1600",
    format: "json",
    origin: "*",
  });
  return `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
};

const allowedMimes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

const resolveCommonsImageUrl = async (query, usedUrls) => {
  await sleep(900);
  const response = await fetchWithRetry(buildCommonsSearchUrl(query), {
    headers: { "User-Agent": "DreamItalyJourney/1.0 image-library-builder" },
  });
  if (!response.ok) {
    throw new Error(`Commons API failed ${response.status} for query: ${query}`);
  }

  const data = await response.json();
  const pages = Object.values(data?.query?.pages ?? {});
  for (const page of pages) {
    const info = page?.imageinfo?.[0];
    if (!info) continue;
    const mime = info.mime?.toLowerCase() ?? "";
    if (!allowedMimes.has(mime)) continue;
    const candidate = info.thumburl ?? info.url;
    if (!candidate) continue;
    if (usedUrls.has(candidate)) continue;
    usedUrls.add(candidate);
    return candidate;
  }

  throw new Error(`No suitable image found for query: ${query}`);
};

const countryQuerySets = (countryName) => [
  `${countryName} university campus`,
  `${countryName} students campus life`,
  `${countryName} city skyline`,
  `${countryName} study abroad`,
  `${countryName} architecture historic city`,
  `${countryName} student library`,
];

const universityQuerySets = (universityName, countryName) => [
  `${universityName} campus ${countryName}`,
  `${universityName} university building`,
  `${countryName} university campus`,
];

const run = async () => {
  const countries = await readCountries();
  await ensureDir(outputRoot);
  await ensureDir(path.join(outputRoot, "common"));

  let downloaded = 0;
  const failures = [];
  const usedUrls = new Set();

  const genericImages = [
    ["visa-main.jpg", "student visa passport airport"],
    ["students-group.jpg", "international students campus"],
    ["study-desk.jpg", "study desk laptop books"],
  ];

  for (const [filename, query] of genericImages) {
    const target = path.join(outputRoot, "common", filename);
    try {
      const imageUrl = await resolveCommonsImageUrl(query, usedUrls);
      await downloadImage(imageUrl, target);
      downloaded += 1;
      console.log(`Downloaded common/${filename}`);
    } catch (error) {
      failures.push(`common/${filename}: ${error.message}`);
    }
  }

  for (const country of countries) {
    const countrySlug = country.slug;
    const countryDir = path.join(outputRoot, "countries", countrySlug);
    await ensureDir(countryDir);

    const countryQueries = countryQuerySets(country.name);
    for (let i = 0; i < countryQueries.length; i += 1) {
      const filename = `img-${String(i + 1).padStart(2, "0")}.jpg`;
      const target = path.join(countryDir, filename);
      try {
        let imageUrl;
        try {
          imageUrl = await resolveCommonsImageUrl(countryQueries[i], usedUrls);
        } catch {
          imageUrl = await resolveCommonsImageUrl(`${country.name} university campus`, usedUrls);
        }
        await downloadImage(imageUrl, target);
        downloaded += 1;
        console.log(`Downloaded countries/${countrySlug}/${filename}`);
      } catch (error) {
        failures.push(`countries/${countrySlug}/${filename}: ${error.message}`);
      }
    }

    const uniDir = path.join(outputRoot, "universities", countrySlug);
    await ensureDir(uniDir);
    for (const university of country.universities) {
      const universitySlug = slugify(university.name);
      const queries = universityQuerySets(university.name, country.name);
      for (let i = 0; i < 2; i += 1) {
        const filename = `${universitySlug}-${i + 1}.jpg`;
        const target = path.join(uniDir, filename);
        try {
          let imageUrl;
          try {
            imageUrl = await resolveCommonsImageUrl(queries[i], usedUrls);
          } catch {
            imageUrl = await resolveCommonsImageUrl(queries[2], usedUrls);
          }
          await downloadImage(imageUrl, target);
          downloaded += 1;
          console.log(`Downloaded universities/${countrySlug}/${filename}`);
        } catch (error) {
          failures.push(`universities/${countrySlug}/${filename}: ${error.message}`);
        }
      }
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    countries: countries.map((country) => ({
      slug: country.slug,
      name: country.name,
      images: Array.from({ length: 6 }, (_, idx) => `/images/library/countries/${country.slug}/img-${String(idx + 1).padStart(2, "0")}.jpg`),
      universities: country.universities.map((university) => ({
        name: university.name,
        slug: slugify(university.name),
        images: [
          `/images/library/universities/${country.slug}/${slugify(university.name)}-1.jpg`,
          `/images/library/universities/${country.slug}/${slugify(university.name)}-2.jpg`,
        ],
      })),
    })),
    common: {
      visa: "/images/library/common/visa-main.jpg",
      students: "/images/library/common/students-group.jpg",
      studyDesk: "/images/library/common/study-desk.jpg",
    },
    stats: {
      attemptedDownloads: 3 + countries.length * 6 + countries.reduce((acc, c) => acc + c.universities.length * 2, 0),
      successfulDownloads: downloaded,
      failures: failures.length,
    },
  };

  await fs.writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
  if (failures.length) {
    await fs.writeFile(path.join(outputRoot, "download-failures.log"), failures.join("\n"));
  }

  console.log(`Success: ${downloaded} images`);
  console.log(`Failures: ${failures.length}`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
