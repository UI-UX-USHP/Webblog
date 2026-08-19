"use client";

import Giscus from "@giscus/react";

type Props = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
};

/** Bình luận qua Giscus (GitHub Discussions) — nhẹ, không cần DB riêng. */
export default function Comments({ repo, repoId, category, categoryId }: Props) {
  return (
    <Giscus
      id="comments"
      repo={repo as `${string}/${string}`}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="vi"
      loading="lazy"
    />
  );
}
