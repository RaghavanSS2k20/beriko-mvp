import Document, { Html, Head, Main, NextScript } from "next/document";
// import { ColorModeScript } from "@chakra-ui/react";
// import theme from "@/theme";

class MyDocument extends Document {
  render() {
    return (
      <Html suppressHydrationWarning>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
          {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /> */}
        </Head>
        <body>
          {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
