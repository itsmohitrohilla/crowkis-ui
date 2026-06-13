import { RoostPost, roostPosts } from "@/lib/content/roost";
import { buildPosts } from "./builder";
import { vsSpecs } from "./vs";
import { useCaseSpecs } from "./use-cases";
import { economicsSpecs } from "./economics";
import { engineeringSpecs } from "./engineering";
import { securitySpecs } from "./security";
import { opsSpecs } from "./ops";

export const allRoostPosts: RoostPost[] = [
  ...roostPosts,
  ...buildPosts([
    ...vsSpecs,
    ...useCaseSpecs,
    ...economicsSpecs,
    ...engineeringSpecs,
    ...securitySpecs,
    ...opsSpecs,
  ]),
].sort((a, b) => b.date.localeCompare(a.date));

export const roostTags = Array.from(new Set(allRoostPosts.map((p) => p.tag)));
