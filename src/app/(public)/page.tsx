import HomeClient from "@/components/home/HomeClient";

export const runtime = 'nodejs'; // CLOUDFLARE FIX: Changed from edge to nodejs

export default function Home() {
  return <HomeClient />;
}
