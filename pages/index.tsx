import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>hipstersmoothie.com</title>
        <meta name="description" content="Andrew Lisowski's personal website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hi! I'm Andrew
        </h1>
      </main>
    </div>
  )
}


