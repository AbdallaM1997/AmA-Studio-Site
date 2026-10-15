import news from '../data/news.json';

/** All posts, newest first. Posts with the same date: the one added later to news.json counts as newer. */
export const postsNewestFirst = news
  .map((post, i) => ({ post, i }))
  .sort((a, b) => b.post.date.localeCompare(a.post.date) || b.i - a.i)
  .map(({ post }) => post);
