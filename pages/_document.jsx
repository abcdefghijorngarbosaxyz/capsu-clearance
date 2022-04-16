import Document, { Html, Head, Main, NextScript } from "next/document";
import ScrollArea from "../components/extras/ScrollArea";

export default class MainDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ScrollArea>
          <body className="min-h-screen bg-gray-100 bg-galaxy bg-fixed dark:bg-gray-900">
            <Main />
          </body>
        </ScrollArea>
        <NextScript />
      </Html>
    );
  }
}
