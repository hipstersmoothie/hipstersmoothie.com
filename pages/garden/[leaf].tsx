import path from "path";
import makeClass from "clsx";
import Head from "next/head";
import { useMemo } from "react";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPropsContext } from "next";
import { promises as fs } from "fs";
import { wikiLinkPlugin } from "remark-wiki-link";
import gfm from "remark-gfm";
import shiki from "rehype-shiki-reloaded";
import { useQueryParam, StringParam } from "use-query-params";

import { Header } from "../../components/Header";
import { NoteSwitcher } from "../../components/NoteSwitcher";
import { components } from "../../components/semantic";
import { getLeaves, LeafObject } from "../../utils/leaves";

interface LeafProps {
  currentLeaf: LeafObject;
  source: string;
  title: string;
  leaves: LeafObject[];
}

const Leaf = ({ source, title, leaves }: LeafProps) => {
  const [inIframeQueryParam] = useQueryParam("in-iframe", StringParam);
  const Component = useMemo(() => getMDXComponent(source), [source]);
  const inIframe = inIframeQueryParam === "true";

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>

      {!inIframe && <Header active="garden" />}

      <div
        className={makeClass(
          "px-4 md:px-10 pt-4 pb-16 max-w-[100ch] mx-auto",
          inIframe ? "pt-0" : "pt-4"
        )}
      >
        <Component components={components} />
      </div>

      <NoteSwitcher leaves={leaves} />
    </div>
  );
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const filePath = path.join(process.cwd(), `pages/garden/${params.leaf}.md`);
  const content = await fs.readFile(filePath, "utf-8");
  const { code } = await bundleMDX(content, {
    files: {},
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        gfm,
        [
          wikiLinkPlugin,
          {
            pageResolver: (name: string) => [name],
            hrefTemplate: (link: string) => `/garden/${link}`,
          },
        ],
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [shiki, { darkTheme: "github-dark" }],
      ];

      return options;
    },
  });

  return {
    props: {
      title: params.leaf,
      source: code,
      leaves: await getLeaves(),
    },
  };
};

export async function getStaticPaths() {
  const leaves = await getLeaves();

  return {
    fallback: false,
    paths: leaves
      .filter(({ file }) => file.endsWith(".md"))
      .map(({ file }) => ({
        params: { leaf: file.replace(".md", "") },
      })),
  };
}

export default Leaf;
