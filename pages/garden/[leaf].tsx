import path from "path";
import Head from "next/head";
import { createContext, useMemo } from "react";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPropsContext } from "next";
import { promises as fs } from "fs";
import { wikiLinkPlugin } from "remark-wiki-link";
import gfm from "remark-gfm";
import shiki from "rehype-shiki-reloaded";
import visit from "unist-util-visit";

import { Header } from "../../components/Header";
import { NoteSwitcher } from "../../components/NoteSwitcher";
import { components, Anchor, HorizontalRule } from "../../components/semantic";
import { GARDEN_DIR, getLeaves, getTags, LeafObject } from "../../utils/leaves";

interface LeafContextShape {
  currentLeaf?: LeafObject;
}

export const LeafContext = createContext<LeafContextShape>({
  currentLeaf: undefined
})

interface LeafProps {
  currentLeaf: LeafObject;
  source: string;
  title: string;
  leaves: LeafObject[];
  backLinks: string[];
}

const Leaf = ({ source, title, leaves, backLinks, currentLeaf }: LeafProps) => {
  const Component = useMemo(() => getMDXComponent(source), [source]);
  const markdownContent = <Component components={components} />;
  const isIframe =
    typeof window === "undefined" ? false : window.top != window.self;

  return (
    <LeafContext.Provider value={{ currentLeaf }}>
      <div id="iframe-preview">
        <Head>
          <title>{title}</title>
        </Head>

        <Header active="garden" />

        <div className="px-4 md:px-10 pb-16 pt-2 md:pt-8 max-w-[100ch] mx-auto">
          {markdownContent}

          {backLinks.length > 0 && (
            <div className="back-links">
              <HorizontalRule />
              <h2 className="font-black text-xl mb-4">Back Links</h2>
              <div>
                {backLinks.map((link) => (
                  <Anchor href={`/garden/${link}`}>{link}</Anchor>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isIframe && <NoteSwitcher leaves={leaves} />}
      </div>
    </LeafContext.Provider>
  );
};

const createTags = () => (tree: any) => {
  const visitor = (node: any) => {
    const { children } = node;

    if (children.length >= 1 && typeof children[0].value === "string") {
      const potentialTags = getTags(children[0].value as string);

      if (potentialTags.length) {
        node.children = potentialTags.map((tag) => ({
          type: "mdxJsxFlowElement",
          name: "Tag",
          attributes: [],
          children: [{ type: "text", value: tag }],
          data: { _xdmExplicitJsx: true },
        }));
      }
    }
  };

  visit(tree, "paragraph", visitor);
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const backLinks = JSON.parse(
    await fs.readFile(path.join(GARDEN_DIR, "back-links.json"), "utf-8")
  );
  const filePath = path.join(GARDEN_DIR, `${params.leaf}.md`);
  const content = await fs.readFile(filePath, "utf-8");
  const { code } = await bundleMDX(content, {
    files: {},
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        gfm,
        createTags,
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
  const leaves = await getLeaves();

  return {
    props: {
      title: params.leaf,
      source: code,
      leaves,
      currentLeaf: leaves.find((l) => l.title === params.leaf),
      backLinks: backLinks[params.leaf as string] || [],
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
