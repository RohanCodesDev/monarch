import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About · Monarch</title>
        <meta name="description" content="About the Monarch starter" />
      </Head>
      <main>
        <header className="header">
          <div className="badge">About Monarch</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <a href="/api/hello">API</a>
          </nav>
        </header>

        <section className="card">
          <h2>Pages Router First</h2>
          <p>
            This starter keeps the familiar pages directory. Add a new file in pages/ to create a route
            instantly. API routes live under pages/api/.
          </p>
        </section>

        <section className="card">
          <h2>Tech Stack</h2>
          <p>Next.js 14, React 18, TypeScript, ESLint, and Prettier are preconfigured.</p>
        </section>

        <p className="footer">Need more? Add components under a components/ folder and import as usual.</p>
      </main>
    </>
  );
}
