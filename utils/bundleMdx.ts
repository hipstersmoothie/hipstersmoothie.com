import * as MDXBundler from "mdx-bundler";
import { wikiLinkPlugin } from "remark-wiki-link";
import gfm from "remark-gfm";
import shiki from "rehype-shiki-reloaded";
import autolinkHeadings from "rehype-autolink-headings";
import slug from "rehype-slug";
import visit from "unist-util-visit";

import { getTags } from "./leaves";

/** Transform "#TAG_NAME" into a "Tag" react component */
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

export const bundleMDX = async (content: string) => {
  const { code } = await MDXBundler.bundleMDX(content, {
    files: {},
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        gfm,
        createTags,
        [
          wikiLinkPlugin,
          {
            aliasDivider: "|",
            pageResolver: (name: string) => {
              console.log({ name });
              return [name];
            },
            hrefTemplate: (link: string) => `/garden/${link}`,
          },
        ],
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        slug,
        [
          autolinkHeadings,
          { behavior: "wrap", properties: { "data-heading": true } },
        ],
        [shiki, { darkTheme: "github-dark" }],
      ];

      return options;
    },
  });

  return code;
};
