import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      className="bg-light dark:bg-black   overflow-auto overflow-x-hidden "
      lang="en"
    >
      <Head title="twitter" />
      <body className=" bg-light dark:bg-black    min-h-fit">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
