"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const InstagramEmbed = dynamic(
  () => import("react-social-media-embed").then((mod) => mod.InstagramEmbed),
  { ssr: false }
);

export default function InstagramPage() {
  const [postUrls, setPostUrls] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("instagramPosts");
    if (raw) {
      const posts = JSON.parse(raw);
      setPostUrls(posts.map((p: any) => p.url));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-yellow-200 to-purple-400 flex flex-col">
      <main className="container mx-auto px-6 py-16 flex-1 flex flex-col">
        <h1 className="text-center text-5xl font-extrabold mb-16 relative inline-block select-none">
          <span className="relative z-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
            Our Instagram Posts
          </span>
          <span className="absolute inset-0 bg-purple-200 opacity-30 rounded-3xl blur-3xl -z-10"></span>
        </h1>

        {postUrls.length === 0 ? (
          <p className="text-center text-gray-900 text-lg opacity-90 tracking-wide font-semibold">
            No Instagram posts added yet.
          </p>
        ) : (
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
            {postUrls.map((url, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-pink-500/60"
                style={{ maxWidth: 380, margin: "0 auto" }}
              >
                <InstagramEmbed url={url} width={350} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
