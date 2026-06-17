import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blogData";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog | Insights, Leadership & Business Coaching",
  description: "Read the latest insights on business strategy, leadership development, communication, and life coaching by Ashay Shah.",
};

export default function BlogPage() {
  return (
    <main className={styles.blogPage}>
      <div className={styles.blogHeader}>
        <p className={styles.eyebrow}>Insights</p>
        <h1>Our Blog</h1>
        <p className={styles.subSubtitle}>Practical insights on business, life, leadership, and communication by Ashay Shah</p>
      </div>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.category}>{post.category}</span>
            </div>
            <div className={styles.imageWrapper}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
                priority={post.slug === "things-successful-businessman-leader-implement"}
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.date}>{post.date}</p>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <span className={styles.readMore}>Read More →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
