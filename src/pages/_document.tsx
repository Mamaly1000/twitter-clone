import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-light dark:bg-black" lang="en">
      <Head />
      <body className="overflow-x-hidden bg-light dark:bg-black  ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
