import Layout from "@/containers/Layout";
import ModalsProvider from "@/providers/ModalsProvider";
import ToastProvider from "@/providers/ToastProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
export const inter = Inter({
  style: "normal",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
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
