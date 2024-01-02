import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/containers/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <div className=" text-white"><Header label="Home" /></div>;
}
