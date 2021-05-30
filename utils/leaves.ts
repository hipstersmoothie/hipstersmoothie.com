import path from "path";
import { promises as fs } from "fs";
import execa from "execa";

export const GARDEN_DIR = path.join(process.cwd(), `pages/garden`);

interface DateProperties {
  lastUpdatedDate: string;
  creationDate: string;
}

export interface LeafObject extends DateProperties {
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

export const getTags = (str: string) => {
  const TAG_REGEX = /^#(.*)$/;
  const tags = str.split(" ");

  if (tags.every((tag) => tag.match(TAG_REGEX))) {
    return tags;
  }

  return [];
};

export const getLeaves = async () => {
  const paths = await fs.readdir(GARDEN_DIR);
  const markdown = paths.filter((p) => p.endsWith(".md"));

  return Promise.all(
    markdown.map(async (file) => {
      const fullPath = path.join(GARDEN_DIR, file);
      const content = await fs.readFile(fullPath, "utf-8");
      const [firstLine] = content.split("\n");

      return {
        file,
        path: fullPath,
        title: file.replace(".md", ""),
        tags: getTags(firstLine),
        ...(await getDate(fullPath)),
      };
    })
  );
};
