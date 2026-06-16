import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogData";
import styles from "./blog.module.css";

export default function BlogPage() {
  return (
    <main className={styles.blogPage}>
      <div className={styles.hero}>
        <h1>Blog</h1>
        <p>Insights on business, life and leadership by Ashay Shah</p>
      </div>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className={styles.image}
              />
              <span className={styles.category}>{post.category}</span>
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