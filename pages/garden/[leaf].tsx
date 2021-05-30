import path from 'path'
import makeClass from 'clsx';
import Head from 'next/head'
import { useMemo, useRef } from "react";
import { useRouter } from 'next/router';
import { bundleMDX } from 'mdx-bundler'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import { GetStaticPropsContext } from "next";
import { promises as fs } from 'fs'
import { wikiLinkPlugin } from 'remark-wiki-link';
import gfm from 'remark-gfm'
import shiki from "rehype-shiki-reloaded";
import CommandPalette from 'react-command-palette';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import { Header } from '../../components/Header'

const Paragraph: React.FC = props => {
  if (typeof props.children === 'object' && 'type' in props.children && props.children.type === 'img') {
    return <>{props.children}</>
  }

  return <p {...props} className="my-6" />
}

const components: ComponentMap = {
  p: Paragraph,
  a: (props) => <a {...props} className="underline text-blue-500" />,
  img: (props) => (
    <div className="my-12">
      <img {...props} className="rounded-xl mx-auto w-full md:w-9/12" />
      <p className="text-sm font-medium my-2 text-center italic">{(props as any).alt}</p>
    </div>
  ),
  hr: (props) => <hr {...props} className="mx-auto h-2 w-8 rounded bg-gray-200 my-10" />,
  ul: (props) => <ul {...props} className="list-disc ml-8 my-8" />,
  ol: (props) => <ol {...props} className="list-decimal ml-8 my-8" />,
  pre: (props) => <pre {...props} className="bg-gray-200 rounded border my-6" />,
  code: (props: { children: React.ReactNode; className?: string }) => {
    if ('className' in props) {
      if (props.className.startsWith('language-')) {
        return <code {...props} className={makeClass(props.className, 'text-gray-600 rounded block py-8 px-6 overflow-auto')} />
      }

      return <code {...props} />
    }

    return <code {...props} className="text-xs rounded px-2 py-1 bg-gray-200 text-gray-900" />
  },
  h1: (props) => <h1 {...props} className="lvl1 text-4xl mt-6 mb-8" />,
  h2: (props) => <h2 {...props} className="lvl2 text-2xl mt-10 mb-6 pb-3 border-b border-gray-300 font-medium" />,
  h3: (props) => <h3 {...props} className="lvl3 text-xl my-4 font-semibold" />,
  h4: (props) => <h4 {...props} className="lvl4 text-lg my-4 font-bold" />,
  h5: (props) => <h5 {...props} className="lvl5 my-4 font-bold" />,
  h6: (props) => <h6 {...props} className="lvl6 text-sm my-4 font-bold" />,
  table: (props) => <table {...props} className="w-full my-6" />,
  th: (props) => <th {...props} className="pb-4 px-3 text-left font-semibold" />,
  td: (props) => <td {...props} className="py-2 px-3 border-b border-t" />,
}

interface LeafProps {
  source: string;
  title: string;
  leafs: string[];
}

const Leaf = ({ source, title, leafs }: LeafProps) => {
  const paletteWrapper = useRef<HTMLDivElement>(null)
  const Component = useMemo(() => getMDXComponent(source), [source])
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>

      <Header active="garden" />

      <div className="px-4 pt-4 pb-16 max-w-[100ch] mx-auto">
        <Component components={components} />

        {typeof window !== 'undefined' && (
          <div ref={paletteWrapper}>
            <CommandPalette
              closeOnSelect
              resetInputOnOpen
              highlightFirstSuggestion={false}
              header={<div className="text-xl mt-2 mb-4 mx-1">Note Switcher</div>}
              placeholder="Type the name of a note"
              hotKeys="command+k"
              onAfterOpen={() => disableBodyScroll(paletteWrapper.current)}
              onRequestClose={() => enableBodyScroll(paletteWrapper.current)}
              onSelect={() => enableBodyScroll(paletteWrapper.current)}
              commands={leafs.map(leaf => {
                const title = leaf.replace(".md", "");
                return { name: title, command: () => router.push(`/garden/${title}`) }
              })}
              theme={{
                modal: "command-modal absolute bg-white w-[90vw] md:w-[605px] top-[10%] left-1/2 p-6 rounded-lg transform -translate-x-2/4 shadow-lg",
                overlay: "atom-overlay",
                header: "color-gray-900",
                input: "w-full bg-gray-100 border border-gray-300 p-2 rounded text-[14px]",
                inputFocused: "border-gray-400 focus:bg-white outline-none",
                suggestionsContainer: "command-list overflow-auto rounded-lg border border-gray-200 mt-4",
                suggestion: "text-gray-900 py-4 px-3 text-[1rem] font-medium border-b border-gray-200 last:border-none",
                suggestionHighlighted: "bg-gray-200 !text-black",
              }}
            />
          </div>
        )}
      </div>

    </div>
  );
};

const getLeaves = async () => {
  const paths = await fs.readdir(path.join(process.cwd(), `pages/garden`));
  return paths.filter((p) => p.endsWith(".md"))
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const filePath = path.join(process.cwd(), `pages/garden/${params.leaf}.md`);
  const content = await fs.readFile(filePath, 'utf-8');
  const { code } = await bundleMDX(content, {
    files: {},
    xdmOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), gfm, [wikiLinkPlugin, {
        pageResolver: (name: string) => [name],
        hrefTemplate: (link: string) => `/garden/${link}`
      }]]
      options.rehypePlugins = [...(options.rehypePlugins ?? []), [shiki, { darkTheme: 'github-dark' }]]

      return options
    },
  })


  return {
    props: {
      title: params.leaf,
      source: code,
      leafs: await getLeaves()
    }
  }
}

export async function getStaticPaths() {
  const leafs = await getLeaves()

  return {
    fallback: false,
    paths: leafs.filter((p) => p.endsWith(".md")).map((file) => ({
      params: { leaf: file.replace('.md', '') },
    })),
  };
}

export default Leaf;
