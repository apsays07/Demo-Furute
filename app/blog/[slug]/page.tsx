"use client";

import { useState, useEffect, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/blogData";
import styles from "./blogPost.module.css";
import ShareButton from "@/components/shared/ShareButton";

type CommentType = {
  _id: string;
  name: string;
  email: string;
  website?: string;
  comment: string;
  parentId?: string | null;
  createdAt: string;
  replies: CommentType[];
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

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

  async function handleReplySubmit(parentId: string) {
    if (!post || !replyText.trim() || !name.trim() || !email.trim()) return;

    setReplySubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug: post.slug,
          name,
          email,
          website,
          comment: replyText,
          parentId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReplyText("");
        setReplyingTo(null);

        if (remember) {
          localStorage.setItem(
            "furute_commenter",
            JSON.stringify({ name, email, website })
          );
        }

        fetchComments();
      }
    } catch {
      console.error("Failed to post reply");
    } finally {
      setReplySubmitting(false);
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

  const totalCommentCount = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  );

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
            <div className={styles.headerMeta}>
              <p className={styles.date}>{post.date}</p>
              <ShareButton imageUrl={post.image} />
            </div>
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
            <div className={styles.authorAvatar}>
              <Image src="/ashay-shah.webp" alt="Ashay Shah" width={56} height={56} className={styles.authorAvatarImg} />
            </div>
            <div>
              <p className={styles.authorName}>Ashay Shah</p>
              <p className={styles.authorRole}>Business Trainer · Life Coach · Furute, Pune</p>
            </div>
          </div>
        </div>

        {/* Existing comments */}
        {totalCommentCount > 0 && (
          <div className={styles.commentsList}>
            <h3 className={styles.commentsHeading}>
              {totalCommentCount} Comment{totalCommentCount !== 1 ? "s" : ""}
            </h3>
            {comments.map((c) => (
              <div key={c._id}>
                {/* Top-level comment */}
                <div className={styles.commentItem}>
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
                    <button
                      className={styles.replyBtn}
                      onClick={() =>
                        setReplyingTo(replyingTo === c._id ? null : c._id)
                      }
                    >
                      {replyingTo === c._id ? "Cancel" : "Reply"}
                    </button>

                    {/* Inline reply form */}
                    {replyingTo === c._id && (
                      <div className={styles.inlineReplyForm}>
                        <textarea
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className={styles.replyTextarea}
                          rows={3}
                          required
                        />
                        {!name && (
                          <div className={styles.replyFormRow}>
                            <input
                              type="text"
                              placeholder="Name *"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={styles.replyInput}
                              required
                            />
                            <input
                              type="email"
                              placeholder="Email *"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={styles.replyInput}
                              required
                            />
                          </div>
                        )}
                        <button
                          className={styles.replySubmitBtn}
                          onClick={() => handleReplySubmit(c._id)}
                          disabled={replySubmitting || !replyText.trim()}
                        >
                          {replySubmitting ? "Posting..." : "Post Reply"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div className={styles.repliesContainer}>
                    {c.replies.map((reply) => (
                      <div key={reply._id} className={styles.replyItem}>
                        <div className={styles.commentAvatar}>
                          {reply.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.commentBody}>
                          <p className={styles.commentName}>{reply.name}</p>
                          <p className={styles.commentDate}>
                            {new Date(reply.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className={styles.commentText}>{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
