import path from "path";
import Head from "next/head";
import { createContext, useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPropsContext } from "next";
import { promises as fs } from "fs";

import { Header } from "../../components/Header";
import { NoteSwitcher } from "../../components/NoteSwitcher";
import { IframeContext } from "../../components/IframeContext";
import { components, Anchor, HorizontalRule } from "../../components/semantic";
import { GARDEN_DIR, getLeaves, LeafObject } from "../../utils/leaves";
import { bundleMDX } from "../../utils/bundleMdx";

interface LeafContextShape {
  currentLeaf?: LeafObject;
}

export const LeafContext = createContext<LeafContextShape>({
  currentLeaf: undefined,
});

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
  const inIframe =
    typeof window === "undefined" ? false : window.top != window.self;

  return (
    <IframeContext.Provider value={{ inIframe }}>
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
                <div className="flex flex-col space-y-2 items-start">
                  {backLinks.map((link) => (
                    <Anchor key={link} href={`/garden/${link}`}>{link}</Anchor>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!inIframe && <NoteSwitcher leaves={leaves} />}
        </div>
      </LeafContext.Provider>
    </IframeContext.Provider>
  );
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const backLinks = JSON.parse(
    await fs.readFile(path.join(GARDEN_DIR, "back-links.json"), "utf-8")
  );
  const filePath = path.join(GARDEN_DIR, `${params.leaf}.md`);
  const content = await fs.readFile(filePath, "utf-8");
  const leaves = await getLeaves();

  return {
    props: {
      title: params.leaf,
      source: await bundleMDX(content),
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
