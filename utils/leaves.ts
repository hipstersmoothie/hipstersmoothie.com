import path from "path";
import { promises as fs } from "fs";
import execa from "execa";

const GARDEN_DIR = path.join(process.cwd(), `pages/garden`);

interface DateProperties {
  lastUpdatedDate: string;
  creationDate: string;
}

export interface LeafObject extends DateProperties {
  file: string;
  path: string;
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

export const getLeaves = async () => {
  const paths = await fs.readdir(GARDEN_DIR);
  const markdown = paths.filter((p) => p.endsWith(".md"));

  return Promise.all(
    markdown.map(async (file) => {
      const fullPath = path.join(GARDEN_DIR, file);

      return {
        file,
        path: fullPath,
        title: file.replace(".md", ""),
        ...(await getDate(fullPath)),
      };
    })
  );
};
