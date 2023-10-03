import fs from "node:fs/promises";
import http from "node:http";
import open from "open";

export const interpolate = (html, data) => {
  // {{ notes }} -> data.notes
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || "";
  });
};

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
      <div>
        <h2>${note.content}</h2>
        <div class="tags">
            ${note.tags.map((tag) => `<span>#${tag}</span>`).join(" ")}
        </div>
      </div>
      `;
    })
    .join("");
};

export const createServer = (notes) => {
  const server = http.createServer(async (req, res) => {
    const HTML_PATH = new URL("./template.html", import.meta.url);
    const template = await fs.readFile(HTML_PATH, "utf-8");
    const html = interpolate(template, { notes: formatNotes(notes) });

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
  return server;
};

export const start = (notes, port) => {
  const server = createServer(notes);
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    open(`http://localhost:${port}/`);
  });
};
