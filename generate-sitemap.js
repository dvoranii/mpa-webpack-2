import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  "",
  "about",
  "contact",
  "quote",
  "special-handling",
  "sporting-goods",
  "air",
  "truck",
  "ocean",
  "warehouse",
];

const baseUrl = "https://cglwebsitetest.xyz";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => {
    const url = page ? `${baseUrl}/${page}` : baseUrl;
    return `<url><loc>${url}</loc></url>`;
  })
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, "dist", "sitemap.xml"), sitemap);

console.log("Sitemap generated!");
