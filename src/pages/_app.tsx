import Layout from "@/containers/Layout";
import ModalsProvider from "@/providers/ModalsProvider";
import ToastProvider from "@/providers/ToastProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ModalsProvider />
      <ToastProvider />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
