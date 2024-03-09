import Header from "@/containers/Header";
import CreatePost from "@/components/forms/CreatePost";
import PostFeed from "@/components/lists/PostFeed ";

export default function Home() {
  return (
    <div className=" text-white">
      <Header main displayProfile label="Home" />
      <CreatePost mainPage placeholder="what is happening?!" />
      <PostFeed />
    </div>
  );
}
