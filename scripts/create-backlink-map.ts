import { promises as fs } from "fs";
import path from "path";
import glob from "fast-glob";
import unified from "unified";
import markdown from "remark-parse";
import { wikiLinkPlugin } from "remark-wiki-link";
import remark2rehype from "remark-rehype";
import stringify from "rehype-stringify";

const getLinks = async (content: string) => {
  const links = [];
  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(stringify)
    .use(wikiLinkPlugin, {
      pageResolver: (name: string) => {
        links.push(name);
        return [name];
      },
      hrefTemplate: (link: string) => `/garden/${link}`,
    });

  await processor.process(content);

  return links;
};

const createBackLinkMap = async () => {
  const backLinks = new Map<string, Set<string>>();
  const notePaths = await glob(path.join(process.cwd(), "pages/garden/*.md"));
  const notes = await Promise.all(
    notePaths.map(
      async (p) =>
        [path.basename(p, ".md"), await fs.readFile(p, "utf-8")] as const
    )
  );

  await Promise.all(
    notes.map(async ([filepath, content]) => {
      const links = await getLinks(content);

      links.forEach((link) => {
        if (!backLinks.has(link)) {
          backLinks.set(link, new Set());
        }

        backLinks.get(link).add(filepath);
      });
    })
  );

  await fs.writeFile(
    path.join(process.cwd(), "pages/garden/back-links.json"),
    JSON.stringify(backLinks, (key, value) =>
      value instanceof Map
        ? Object.fromEntries([...value])
        : value instanceof Set
        ? [...value]
        : value
    )
  );
};

createBackLinkMap();
