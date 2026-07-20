export type RoostBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "code"; title?: string; code: string }
  | { kind: "art"; title?: string; svg: string; caption?: string }
  | { kind: "diagram"; title: string; chart: string; caption?: string }
  | {
      kind: "venn";
      title: string;
      left: string;
      right: string;
      overlap: string;
      leftItems?: string[];
      rightItems?: string[];
      caption?: string;
    }
  | { kind: "plain"; text: string }
  | { kind: "quote"; text: string }
  | {
      kind: "bars";
      title: string;
      unit?: string;
      series: { label: string; value: number; sub?: string; accent?: boolean }[];
      caption?: string;
    };

export type RoostPost = {
  slug: string;
  title: string;
  date: string;
  readMinutes: number;
  tag: string;
  summary: string;
  blocks: RoostBlock[];
};

// Blog posts now live in Supabase (read via src/lib/posts.ts). Empty fallback.
export const roostPosts: RoostPost[] = [];
