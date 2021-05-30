import format from "date-fns/format";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";
import { NoteSwitcher } from "../components/NoteSwitcher";
import {
  Blockquote,
  BlockQuoteAuthor,
  HorizontalRule,
  Paragraph,
  UnorderedList,
  Anchor,
} from "../components/semantic";
import { getLeaves, LeafObject } from "../utils/leaves";

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

      <main className="pb-16">
        <div className="px-8 max-w-xl mx-auto">
          <h1 className="text-3xl font-semibold mt-10 mb-6">
            Welcome to my Digital Garden!
          </h1>

          <h2 className="text-lg font-medium mb-2">What the heck is this?!</h2>

          <Blockquote
            author={
              <BlockQuoteAuthor href="https://maggieappleton.com/">
                Maggie Appleton
              </BlockQuoteAuthor>
            }
          >
            <Paragraph>
              An open collection of notes, resources, sketches, and explorations
              I'm currently cultivating. Some notes are Seedlings, some are
              budding, and some are fully grown Evergreen.
            </Paragraph>
          </Blockquote>
        </div>

        <HorizontalRule />

        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-xl mx-auto mb-10">
            <p>
              You can navigate through the notes in my Digital Garden in two
              ways:
            </p>

            <UnorderedList>
              <li>
                Click on the{" "}
                <Anchor href="/garden/Terminal Setup">
                  special pink links
                </Anchor>{" "}
                each each note. These links only link to other notes in my
                Digital Garden.
              </li>
              <li>
                Use the Note Switcher{" "}
                <span className="bg-pink-300 text-pink-900 text-sm px-2 py-[0.125rem] rounded">
                  CMD+K
                </span>{" "}
                to search through the garden
              </li>
            </UnorderedList>
          </div>
          <div className="grid items-baseline gap-4 sm:grid-cols-2 md:grid-cols-4">
            {leaves.map((leaf) => (
              <Link
                passHref
                href={`/garden/${leaf.title}`}
                key={`/garden/${leaf.title}`}
              >
                <a className="border rounded-lg px-6 py-5 shadow-none transition-shadow hover:shadow-lg hover:border-pink-400 active:shadow">
                  <h2 className="text-lg mb-2">{leaf.title}</h2>
                  <time
                    dateTime={leaf.lastUpdatedDate}
                    className="text-gray-700 text-sm"
                  >
                    {format(new Date(leaf.lastUpdatedDate), "MMM dd, yyyy")}
                  </time>
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
