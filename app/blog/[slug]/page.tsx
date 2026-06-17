"use client";

import { useState, useEffect, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/blogData";
import styles from "./blogPost.module.css";

type CommentType = {
  _id: string;
  name: string;
  email: string;
  website?: string;
  comment: string;
  createdAt: string;
};

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [commentText, setCommentText] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!post) return;
    try {
      const res = await fetch(`/api/comments?postSlug=${post.slug}`);
      const data = await res.json();
      if (data.success) setComments(data.data);
    } catch (_err) {
      console.error("Failed to load comments", _err);
    }
  }, [post]);

  useEffect(() => {
    if (!post) return;

    // Load saved info if "remember me" was used before
    const saved = localStorage.getItem("furute_commenter");
    if (saved) {
      const parsed = JSON.parse(saved);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setWebsite(parsed.website || "");
      setRemember(true);
    }

    fetchComments();
  }, [post, fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug: post.slug,
          name,
          email,
          website,
          comment: commentText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMsg("Your comment has been posted!");
        setCommentText("");

        if (remember) {
          localStorage.setItem(
            "furute_commenter",
            JSON.stringify({ name, email, website })
          );
        } else {
          localStorage.removeItem("furute_commenter");
        }

        fetchComments();
      } else {
        setStatusMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatusMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!post) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.back}>
            ← Back to Blog
          </Link>
          <h1>Post not found</h1>
        </div>
      </main>
    );
  }

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/blog" className={styles.back}>
          ← Back to Blog
        </Link>

        <div className={styles.articleWrapper}>
          <div className={styles.header}>
            <span className={styles.category}>{post.category}</span>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.date}>{post.date}</p>
          </div>

          <div className={styles.imageWrapper}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className={styles.image}
              priority
            />
          </div>

          <article className={styles.content}>
            {paragraphs.map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h3 key={i} className={styles.subheading}>
                    {para.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              if (para.startsWith("- ")) {
                const items = para.split("\n").filter(Boolean);
                return (
                  <ul key={i} className={styles.list}>
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              const withBold = para.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
              return (
                <p
                  key={i}
                  className={styles.para}
                  dangerouslySetInnerHTML={{ __html: withBold }}
                />
              );
            })}
          </article>

          <div className={styles.author}>
            <div className={styles.authorAvatar}>AS</div>
            <div>
              <p className={styles.authorName}>Ashay Shah</p>
              <p className={styles.authorRole}>Business Trainer · Life Coach · Furute, Pune</p>
            </div>
          </div>
        </div>

        {/* Existing comments */}
        {comments.length > 0 && (
          <div className={styles.commentsList}>
            <h3 className={styles.commentsHeading}>
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </h3>
            {comments.map((c) => (
              <div key={c._id} className={styles.commentItem}>
                <div className={styles.commentAvatar}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.commentBody}>
                  <p className={styles.commentName}>{c.name}</p>
                  <p className={styles.commentDate}>
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className={styles.commentText}>{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Reply form */}
        <div className={styles.replySection}>
          <h3 className={styles.replyHeading}>Leave a Reply</h3>
          <form onSubmit={handleSubmit} className={styles.replyForm}>
            <textarea
              placeholder="Write your comment..."
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={styles.textarea}
              rows={5}
            />

            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Name *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={styles.input}
              />
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Save my name, email, and website in this browser for the next time I comment.
            </label>

            {statusMsg && <p className={styles.statusMsg}>{statusMsg}</p>}

            <button type="submit" disabled={submitting} className={styles.submitBtn}>
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
