import Head from "next/head";
import Link from "next/link";

import { PlantHealth } from "../../components/PlantHealth";
import { Time } from "../../components/Time";
import { Header } from "../../components/Header";
import { NoteSwitcher } from "../../components/NoteSwitcher";
import {
  Blockquote,
  BlockQuoteAuthor,
  HorizontalRule,
  Paragraph,
  Anchor,
} from "../../components/semantic";
import { getLeaves, LeafObject } from "../../utils/leaves";
import { PlantIcon } from "../../components/icons/PlantIcon";
import { NotebookIcon } from "../../components/icons/NotebookIcon";
import { LinkIcon } from "../../components/icons/LinkIcon";

interface GardenProps {
  leaves: LeafObject[];
}

export default function Garden({ leaves = [] }: GardenProps) {
  return (
    <div>
      <Head>
        <title>Digital Garden</title>
        <meta name="description" content="Andrew Lisowski's digital garden" />
      </Head>

      <Header active="garden" />

      <main className="pb-20 md:pb-32">
        <div
          className="px-6 bg-cover py-8"
          style={{
            backgroundImage: "url(mesh.png)",
            backgroundSize: "100% 100%",
          }}
        >
          <div className="max-w-2xl lg:max-w-4xl mx-auto flex flex-col ">
            <svg viewBox="0 0 200 28" className="mb-6">
              <text className="stroke-text svg-text font-black" x="1" y="20">
                My Digital Garden
              </text>
              <text className="svg-text font-black" x="1" y="20">
                My Digital Garden
              </text>
            </svg>

            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-medium mb-2">
                  What the heck is this?!
                </h2>

                <Blockquote
                  className="md:max-w-lg"
                  author={
                    <BlockQuoteAuthor href="https://maggieappleton.com/">
                      Maggie Appleton
                    </BlockQuoteAuthor>
                  }
                >
                  <Paragraph>
                    An open collection of notes, resources, sketches, and
                    explorations I'm currently cultivating. Some notes are
                    Seedlings, some are budding, and some are fully grown
                    Evergreen.
                  </Paragraph>
                </Blockquote>
              </div>

              <PlantIcon
                fill="white"
                className="hidden md:block w-[125px] lg:w-[200px]"
              />
            </div>
          </div>
        </div>

        <HorizontalRule />

        <div className="max-w-[120ch] mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-10 md:mb-20">
            <p className="text-lg md:text-xl">
              You can navigate through the notes in my Digital Garden in a few
              ways:
            </p>

            <div
              className="grid gap-6 my-8 items-center"
              style={{ gridTemplateColumns: "40px auto" }}
            >
              <div className="rounded-xl bg-pink-500 h-[45px] w-[45px] flex items-center justify-center self-start">
                <LinkIcon height={20} width={20} fill="white" />
              </div>
              <span className="md:text-lg">
                Click on the{" "}
                <Anchor href="/garden/Terminal Setup">
                  special pink links
                </Anchor>{" "}
                each each note. These links only link to other notes in my
                Digital Garden.
              </span>
              <div className="rounded-xl bg-pink-500 h-[45px] w-[45px] flex items-center justify-center self-start">
                <NotebookIcon height={22} width={22} fill="white" />
              </div>
              <span className="md:text-lg">
                Use the Note Switcher{" "}
                <span className="bg-pink-300 text-pink-900 text-sm px-2 py-[0.125rem] rounded">
                  CMD+K
                </span>{" "}
                to search through the garden
              </span>
            </div>
          </div>
          <div className="grid items-baseline gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {leaves.map((leaf) => (
              <Link
                passHref
                href={`/garden/${leaf.title}`}
                key={`/garden/${leaf.title}`}
              >
                <a className="border rounded-lg px-6 py-5 shadow-none transition-shadow hover:shadow-lg hover:border-gray-400 active:shadow">
                  <div className="flex justify-between space-x-4">
                    <h2 className="text-lg mb-2">{leaf.title}</h2>
                    <PlantHealth leaf={leaf} />
                  </div>

                  <Time
                    date={leaf.lastUpdatedDate || new Date().toLocaleString()}
                    className="text-gray-700 text-sm"
                  />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <NoteSwitcher leaves={leaves} />
    </div>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      leaves: await getLeaves(),
    },
  };
};
