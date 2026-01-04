import Head from 'next/head';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/homepg',
      permanent: false,
    },
  };
};

export default function Home() {
  // This component won't render due to server-side redirect
  return (
    <>
      <Head>
        <title>Monarch | Historic Artifacts Explorer</title>
        <meta name="description" content="Discover prehistoric cave paintings, ancient artifacts & archaeological treasures with AI" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mb-4"></div>
          <p className="text-amber-100 text-xl">Redirecting...</p>
        </div>
      </div>
    </>
  );
}
