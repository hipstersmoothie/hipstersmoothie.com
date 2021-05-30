import Head from "next/head";
import { Header } from "../components/Header";

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
        <div className="h-64 flex items-center justify-center">
          <h1 className="text-4xl font-black text-center">Hi! I'm Andrew</h1>
        </div>
      </main>
    </div>
  );
}
