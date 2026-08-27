/**
 * 客户端搜索索引 — 为每篇文章预计算可搜索纯文本（含正文去 HTML），
 * 用于 Posts 列表页的全文搜索，无需额外请求。
 */
import { posts, type Post } from "./posts";

export interface SearchRecord {
  slug: string;
  title: string;
  category: string;
  date: string;
  tags: string[];
  /** 小写的纯文本串，用于 .includes() 匹配 */
  haystack: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildHaystack(p: Post): string {
  const parts = [
    p.title,
    p.excerpt,
    p.category,
    p.tags.join(" "),
    stripHtml(p.content),
  ];
  return parts.join(" ").toLowerCase();
}

export const searchIndex: SearchRecord[] = posts.map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  date: p.date,
  tags: p.tags,
  haystack: buildHaystack(p),
}));

/**
 * 对搜索索引做多词 AND 匹配。
 * 空 query 返回全部记录（调用方决定是否显示）。
 */
export function searchPosts(query: string): SearchRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return searchIndex;
  const terms = q.split(/\s+/).filter(Boolean);
  return searchIndex.filter((r) => terms.every((t) => r.haystack.includes(t)));
}

/**
 * 给定 SearchRecord 和 query，返回匹配上下文摘要（前后 ~20 字）。
 * 用于搜索结果预览，query 为空时返回 excerpt 前 40 字。
 */
export function matchSnippet(rec: SearchRecord, query: string): string {
  const q = query.trim().toLowerCase();
  if (!q || !rec.haystack) return rec.title.slice(0, 60);

  const idx = rec.haystack.indexOf(q);
  if (idx === -1) return rec.title.slice(0, 60);

  const start = Math.max(0, idx - 20);
  const end = Math.min(rec.haystack.length, idx + q.length + 40);
  let snippet = rec.haystack.slice(start, end).trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < rec.haystack.length) snippet = snippet + "…";
  return snippet;
}