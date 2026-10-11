import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Hagnos Eggs — Farm-fresh eggs for Lagos businesses</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00E676" />
        <meta name="description" content="Order Wed–Mon, delivered Tuesday. Prices locked all week." />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
