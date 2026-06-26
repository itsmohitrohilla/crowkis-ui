import { RoostPost, roostPosts } from "@/lib/content/roost";
import { buildPosts } from "./builder";
import { vsSpecs } from "./vs";
import { useCaseSpecs } from "./use-cases";
import { economicsSpecs } from "./economics";
import { engineeringSpecs } from "./engineering";
import { securitySpecs } from "./security";
import { opsSpecs } from "./ops";
import { featuresSpecs } from "./features-deep";
import { benchmarkPosts } from "./benchmarks-posts";

export const allRoostPosts: RoostPost[] = [
  ...roostPosts,
  ...benchmarkPosts,
  ...buildPosts([
    ...vsSpecs,
    ...useCaseSpecs,
    ...economicsSpecs,
    ...engineeringSpecs,
    ...securitySpecs,
    ...opsSpecs,
    ...featuresSpecs,
  ]),
].sort((a, b) => b.date.localeCompare(a.date));

export const roostTags = Array.from(new Set(allRoostPosts.map((p) => p.tag)));
