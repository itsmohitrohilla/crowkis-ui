import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Crowkis — The Roost";
export const dynamicParams = true;

export async function generateStaticParams() {
  // OG images are heavy to render; pre-build recent ones, rest render on-demand.
  const posts = await getAllPosts();
  return posts.slice(0, 120).map((post) => ({ slug: post.slug }));
}

// Per-post branded OG card so every blog link previews with its own title.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title ?? "The Roost";
  const tag = post?.tag ?? "engineering";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAF7F1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 16, height: "100%", background: "#D62221" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 34, height: 34, background: "#D62221", borderRadius: 7 }} />
            <div style={{ fontSize: 26, fontWeight: 800, color: "#16130E", letterSpacing: 2 }}>
              CROWKIS
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#8A8275", letterSpacing: 3 }}>
              {`· THE ROOST · ${tag.toUpperCase()}`}
            </div>
          </div>
          <div
            style={{
              fontSize: title.length > 60 ? 54 : 64,
              fontWeight: 800,
              color: "#16130E",
              lineHeight: 1.08,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 24, color: "#4A443A" }}>
              Engineering notes from the people building Crowkis.
            </div>
            <div style={{ fontSize: 24, color: "#16130E", fontWeight: 700 }}>crowkis.com</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
