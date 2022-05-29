import Head from "next/head";
import Image from "next/image";
import { Header } from "../components/Header";
import { Anchor, Code } from "../components/semantic";
import { Star } from "react-feather";

function ProjectDescription({
  title,
  description,
  image,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  image: React.ReactNode;
}) {
  return (
    <>
      <h3 className="text-3xl font-semibold mb-8 border-b pb-2 mt-10 my-8">
        {title}
      </h3>
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="flex-1 flex flex-col justify-center">{description}</div>
        <div className="my-6 md:m-12 md:flex-1 flex items-center justify-center">
          <div className="border border-grey-200 w-full">{image}</div>
        </div>
      </div>
    </>
  );
}

function Repository({
  slug,
  name = slug,
  description,
  language,
  stars,
}: {
  slug: string;
  name?: string;
  description: React.ReactNode;
  language: string;
  stars: string;
}) {
  return (
    <a
      className="flex gap-2 flex-col items-start  rounded-sm border border-gray-300 p-5"
      href={`https://github.com/${slug}`}
    >
      <Code>{name || slug}</Code>
      <p className="px-1">{description}</p>
      <div className="flex gap-4">
        <div className="flex gap-1 items-center text-gray-500 text-sm">
          <div className={`w-3 h-3 bg-blue-500 rounded-full`} />
          <span>{language}</span>
        </div>
        <div className="flex gap-1 items-center text-gray-500 text-sm">
          <Star className="w-4 h-4" />
          <span>{stars}</span>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>hipstersmoothie.com</title>
        <meta name="description" content="Andrew Lisowski's personal website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <div className="py-10 bg-pink-100 text-pink-900 px-10">
          <div className="flex items-center justify-center flex-col-reverse sm:flex-row gap-8 lg:gap-20 max-w-6xl m-auto">
            <div className="flex gap-4 sm:gap-8 flex-col items-center sm:items-start">
              <h1 className="text-3xl sm:text-5xl font-black">
                Hi! I'm Andrew
              </h1>
              <h2 className="text-2xl lg:text-3xl font-normal">
                I'm a front end dev that likes to make tools 🔧
              </h2>
            </div>

            <div className="h-[40%] w-[40%]">
              <Image
                src="/Andrew_Bday_Sticker_1.png"
                layout="responsive"
                height={200}
                width={200}
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        <div className="w-[100vw] bg-pink-200 text-pink-900">
          <div className="max-w-[120ch] px-6 md:px-10 pt-12 md:py-12 mt-12 m-auto">
            <h2 className="text-4xl font-semibold mb-8">Projects</h2>

            <p className="text-xl mb-6">
              While I'd like to say that I've meade heaps of money off all my
              side projects, that very much isn't the case. My projects usually
              center around creating an experience for an existing website or
              source of data that fits my needs.
            </p>

            <p className="text-xl">
              The following list is by no means a comprehensive list of all the
              side projects I've worked on. This list compromises the tools that
              have withstood the test of time (for me) and I use them almost
              daily. The coolest thing about be a programmer to me is that I can
              creates things like this just for me. Make the web your own!
            </p>
          </div>
        </div>

        <div className="max-w-[120ch] px-6 md:px-10 py-6 md:py-10 m-auto">
          <ProjectDescription
            title={
              <Anchor href="https://kikbak.tv" className="no-underline">
                kikbak.tv
              </Anchor>
            }
            description={
              <>
                <p className="text-xl mb-6">
                  Originally conceived as a way to create shared YouTube
                  playlists while hanging out with my friends in college,
                  kikbak.tv morphed into a way to discover new music videos.
                </p>
                <p className="text-xl mb-6">
                  I listen to a lot of new music, and I absolutely love
                  experiencing new music through music videos. With the death of
                  MTV finding new music videos as they come out can be daunting.
                  Taking heavy inspriation from{" "}
                  <Anchor href="https://en.wikipedia.org/wiki/We_Are_Hunted">
                    WeAreHunted.com
                  </Anchor>{" "}
                  I created kikbak.tv.
                </p>
                <p className="text-xl mb-6">
                  Kikbak.tv scans 1000s of music blogs daily to find new music
                  videos. It tracks play and social media share to create a top
                  100 for the week and for the month. I like to call this
                  website a tool to be and "automated hipster". It creates an
                  effortless way to consume new music and discover new bands.
                </p>
              </>
            }
            image={
              <Image
                layout="responsive"
                src="/kikbak.png"
                height={999}
                width={1352}
                className="rounded"
                alt="A screenshot of kikbak.tv"
              />
            }
          />

          <ProjectDescription
            title={
              <Anchor
                href="https://github-activity-viewer.vercel.app"
                className="no-underline"
              >
                GitHub Activity Viewer
              </Anchor>
            }
            description={
              <>
                <p className="text-xl mb-6">
                  I really only use 2 social networks:{" "}
                  <Anchor href="https://twitter.com/HipsterSmoothie">
                    Twitter
                  </Anchor>
                  {" and "}
                  <Anchor href="https://github.com/hipstersmoothie">
                    GitHub
                  </Anchor>
                  . I discover lots of cool things on twitter from the people I
                  follow and wanted to have the same experience on GitHub.
                </p>
                <p className="text-xl mb-6">
                  While GitHub <em>does</em> have a home news feeds where
                  information about what the people you follow are doing, it
                  isn't very good. The <em>data</em> is there but not the{" "}
                  <em>insights</em>.
                </p>
                <p className="text-xl mb-6">
                  Using the GitHub API I took that data and organized it in a
                  way that's useful for me. It allows me to see at a glance what
                  repos are being starred by large amounts of people I follow,
                  alerting me to cool new tools and projects.
                </p>
              </>
            }
            image={
              <Image
                layout="responsive"
                src="/activity-viewer.png"
                height={999}
                width={1352}
                className="rounded"
                alt="A screenshot of the github activity viewer"
              />
            }
          />

          <ProjectDescription
            title={
              <Anchor
                href="https://www.pitchforkify.com/"
                className="no-underline"
              >
                Pitchforkify
              </Anchor>
            }
            description={
              <>
                <p className="text-xl mb-6">
                  One of my favorite place to read about music news that has
                  stayed with me through the years is{" "}
                  <Anchor href="https://www.pitchfork.com/">Pitchfork</Anchor>.
                  Pitchfork has been around for decades reviewing 2-4 albums a
                  day. While the reviews can be quite critical, they are
                  entertaining and offer a guide to consuming lots of music you
                  might not have heard of otherwise. Unfortunately their
                  websites doesn't an offer an easy way to play the music you're
                  reading about!
                </p>
                <p className="text-xl mb-6">
                  Pitchforkify combines every review Pitchfork has ever
                  published with a player connected to spotify. Listening to the
                  day's album reviews is as easy as pressing play on the first
                  album.
                </p>
                <p className="text-xl mb-6">
                  The site also allows you to filter the review by genre, score
                  and date to help you find old gems. You can also see how your
                  likes on spotify have scored in the reviews. My average is
                  7.6!
                </p>
                <p className="text-xl mb-6">
                  Due to this site breaking almost all of spotify's API rules,
                  only approved accounts can use it. If you want to try it out
                  just tweet me your email!
                </p>
              </>
            }
            image={
              <Image
                layout="responsive"
                src="/pitchfork.png"
                height={999}
                width={1352}
                className="rounded"
                alt="A screenshot of the github activity viewer"
              />
            }
          />
        </div>

        <div className="w-[100vw] bg-pink-200 text-pink-900">
          <div className="max-w-[120ch] px-6 md:px-10 pt-12 md:py-12 mt-12 m-auto">
            <h2 className="text-4xl font-semibold mb-8">Open Source</h2>

            <p className="text-xl mb-6">
              I'm a big fan of open source software. I love being able to crack
              open a repo and decipher how a library does it's magic. I'm always
              amazed at how much awesome code is open source and freely
              available to use. While I might not be the most active maintainer
              (active open source maintenance is a young man's game!), I do have
              a few packages that I maintain.
            </p>

            <p className="text-xl">
              I make lots of tiny plugins for all the tools I use. The following
              aren't all my packages, but the ones I'm most proud of!
            </p>
          </div>
        </div>

        <div className="max-w-[120ch] px-6 md:px-10 py-6 md:py-10 m-auto grid grid-cols-2 gap-4">
          <Repository
            slug="intuit/auto"
            description="Generate releases based on semantic version labels on pull
              requests."
            language="TypeScript"
            stars="1.7k"
          />
          <Repository
            slug="hipstersmoothie/storybook-dark-mode"
            name="storybook-dark-mode"
            description="A storybook addon that lets your users toggle between dark and light mode."
            language="TypeScript"
            stars="309"
          />
          <Repository
            slug="intuit/design-systems-cli"
            description="A CLI toolbox for creating design systems."
            language="TypeScript"
            stars="337"
          />
          <Repository
            slug="hipstersmoothie/storybook-addon-react-docgen"
            name="storybook-addon-react-docgen"
            description="A storybook addon to display react docgen info."
            language="TypeScript"
            stars="82"
          />
          <Repository
            slug="hipstersmoothie/react-docgen-typescript-plugin"
            name="react-docgen-typescript-plugin"
            description="A webpack plugin to inject react typescript docgen information"
            language="TypeScript"
            stars="39"
          />
          <Repository
            slug="hipstersmoothie/bmp-ts"
            name="bmp-ts"
            description="A pure typescript bmp encoder and decoder"
            language="TypeScript"
            stars="6"
          />
          <Repository
            slug="hipstersmoothie/rehype-shiki-reloaded"
            name="rehype-shiki-reloaded"
            description="A rehype plugin for syntax highlighting using shiki that supports dark mode."
            language="TypeScript"
            stars="3"
          />
          <Repository
            slug="hipstersmoothie/react-glider"
            name="react-glider"
            description="A react wrapper for glider.js"
            language="TypeScript"
            stars="121"
          />
        </div>
      </main>
    </div>
  );
}
