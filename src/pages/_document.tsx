import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-light dark:bg-black overflow-auto" lang="en">
      <Head title="twitter" />
      <body className=" bg-light dark:bg-black   overflow-auto overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
