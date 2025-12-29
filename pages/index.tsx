import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Monarch | Next.js Pages</title>
        <meta name="description" content="Monarch starter on Next.js pages router" />
      </Head>
      <main>
        <header className="header">
          <div className="badge">Next.js · Pages Router</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <a href="/api/hello">API</a>
          </nav>
        </header>

        <section className="card-grid">
          <div className="card">
            <h2>Welcome</h2>
            <p>
              Monarch is ready for the classic pages router. Edit any file under the pages directory
              and your routes update instantly.
            </p>
          </div>

          <div className="card">
            <h2>Commands</h2>
            <p>Use npm run dev to start the dev server, npm run build to prepare for production.</p>
          </div>

          <div className="card">
            <h2>Styling</h2>
            <p>Global styles live in styles/globals.css. Extend or replace them as you ship features.</p>
          </div>

          <div className="card">
            <h2>API Route</h2>
            <p>Try the built-in API example at /api/hello. Replace it with your own handlers.</p>
          </div>
        </section>

        <p className="footer">Built with Next.js 14 · React 18 · Pages Router</p>
      </main>
    </>
  );
}
