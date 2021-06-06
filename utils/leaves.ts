import path from "path";
import { promises as fs } from "fs";
import execa from "execa";
import compareDesc from "date-fns/compareDesc";

export const GARDEN_DIR = path.join(process.cwd(), `pages/garden`);

export interface EditProperties {
  edits: number;
}

export interface DateProperties {
  lastUpdatedDate: string;
  creationDate: string;
}

export interface LeafObject extends DateProperties, EditProperties {
  file: string;
  path: string;
  tags: string[];
  title: string;
}

const getDate = async (filename: string): Promise<DateProperties> => {
  const { stdout } = await execa("git", ["log", "--format=%aD", `${filename}`]);
  const dates = stdout.split("\n");

  return {
    creationDate: dates[dates.length - 1],
    lastUpdatedDate: dates[0],
  };
};

const getEdits = async (filename: string): Promise<number> => {
  const { stdout } = await execa("git", ["log", "--oneline", `${filename}`]);

  return stdout.split("\n").length;
};

export const getTags = (str: string) => {
  const TAG_REGEX = /^#(.*)$/;
  const tags = str
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tags.every((tag) => tag.match(TAG_REGEX))) {
    return tags;
  }

  return [];
};

export const getLeaves = async () => {
  const paths = await fs.readdir(GARDEN_DIR);
  const markdown = paths.filter((p) => p.endsWith(".md"));

  const leaves = await Promise.all(
    markdown.map(async (file) => {
      const fullPath = path.join(GARDEN_DIR, file);
      const content = await fs.readFile(fullPath, "utf-8");
      const [firstLine] = content.split("\n");

      return {
        file,
        path: fullPath,
        title: file.replace(".md", ""),
        tags: getTags(firstLine),
        edits: await getEdits(fullPath),
        ...(await getDate(fullPath)),
      };
    })
  );

  return leaves.sort((a, b) => {
    const aDate = a.lastUpdatedDate ? new Date(a.lastUpdatedDate) : new Date();
    const bDate = b.lastUpdatedDate ? new Date(b.lastUpdatedDate) : new Date();

    return compareDesc(aDate, bDate);
  });
};
