import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/containers/Header";
import CreatePost from "@/components/forms/CreatePost";
import PostFeed from "@/components/lists/PostFeed ";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className=" text-white">
      <Header label="Home" />
      <CreatePost placeholder="your tweet ...." />
      <PostFeed />
    </div>
  );
}
