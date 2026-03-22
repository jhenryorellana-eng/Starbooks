"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Heart, MessageCircle, Send, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

interface CommunityFeedProps {
  bookId: string;
  userId: string | null;
}

export function CommunityFeed({ bookId, userId }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const supabase = useRef(createClient()).current;

  useEffect(() => {
    loadPosts();
    // Realtime subscription
    const channel = supabase
      .channel("community-posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "step6_community_posts",
          filter: `book_id=eq.${bookId}`,
        },
        () => loadPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookId]);

  async function loadPosts() {
    const { data } = await supabase
      .from("step6_community_posts")
      .select("*, profiles(full_name, avatar_url)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });
    if (data) setPosts(data as Post[]);
  }

  async function handleCreatePost() {
    if (!newPost.trim() || !userId) return;
    setPosting(true);
    await supabase.from("step6_community_posts").insert({
      book_id: bookId,
      user_id: userId,
      content: newPost.trim(),
    });
    setNewPost("");
    setPosting(false);
    loadPosts();
  }

  async function handleLike(postId: string) {
    if (!userId) return;
    const { data: existing } = await supabase
      .from("step6_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    const currentCount = posts.find((p) => p.id === postId)?.likes_count ?? 0;

    if (existing) {
      await supabase.from("step6_likes").delete().eq("id", existing.id);
      await supabase
        .from("step6_community_posts")
        .update({ likes_count: Math.max(0, currentCount - 1) })
        .eq("id", postId);
    } else {
      await supabase.from("step6_likes").insert({ post_id: postId, user_id: userId });
      await supabase
        .from("step6_community_posts")
        .update({ likes_count: currentCount + 1 })
        .eq("id", postId);
    }
    loadPosts();
  }

  async function toggleComments(postId: string) {
    if (expandedComments === postId) {
      setExpandedComments(null);
      return;
    }
    setExpandedComments(postId);
    const { data } = await supabase
      .from("step6_comments")
      .select("*, profiles(full_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at");
    if (data) setComments((prev) => ({ ...prev, [postId]: data as Comment[] }));
  }

  async function handleCreateComment(postId: string) {
    if (!newComment.trim() || !userId) return;
    setCommentingOn(postId);
    await supabase.from("step6_comments").insert({
      post_id: postId,
      user_id: userId,
      content: newComment.trim(),
    });
    setNewComment("");
    setCommentingOn(null);
    // Reload comments
    const { data } = await supabase
      .from("step6_comments")
      .select("*, profiles(full_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at");
    if (data) setComments((prev) => ({ ...prev, [postId]: data as Comment[] }));
    loadPosts();
  }

  function formatDate(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Ahora";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  return (
    <div className="space-y-6">
      {/* Crear post */}
      {userId && (
        <div className="rounded-2xl bg-white/[0.03] border border-border-subtle p-4 space-y-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Comparte tu opinion sobre este libro..."
            rows={3}
            className="w-full resize-none rounded-xl bg-white/[0.03] border border-border-subtle px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/40 transition-colors"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCreatePost}
              isLoading={posting}
              disabled={!newPost.trim()}
              size="sm"
            >
              <Send className="h-3.5 w-3.5" />
              Publicar
            </Button>
          </div>
        </div>
      )}

      {/* Feed */}
      <AnimatePresence initial={false}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/[0.03] border border-border-subtle p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/[0.08] flex items-center justify-center overflow-hidden">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-text-muted" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {post.profiles?.full_name ?? "Estudiante"}
                </p>
                <p className="text-xs text-text-muted">
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>

            {/* Contenido */}
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {post.image_url && (
              <img
                src={post.image_url}
                alt=""
                className="rounded-xl max-h-64 object-cover"
              />
            )}

            {/* Acciones */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors cursor-pointer"
              >
                <Heart className="h-4 w-4" />
                {post.likes_count > 0 && post.likes_count}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                {post.comments_count > 0 && post.comments_count}
              </button>
            </div>

            {/* Comentarios expandidos */}
            {expandedComments === post.id && (
              <div className="border-t border-border-subtle pt-3 space-y-3">
                {(comments[post.id] ?? []).map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                      <User className="h-3 w-3 text-text-muted" />
                    </div>
                    <div>
                      <p className="text-xs text-text-primary">
                        <span className="font-medium">
                          {comment.profiles?.full_name ?? "Estudiante"}
                        </span>
                        <span className="text-text-muted ml-2">
                          {formatDate(comment.created_at)}
                        </span>
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                {userId && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateComment(post.id);
                      }}
                      placeholder="Escribe un comentario..."
                      className="flex-1 rounded-lg bg-white/[0.04] border border-border-subtle px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/40"
                    />
                    <button
                      onClick={() => handleCreateComment(post.id)}
                      disabled={!newComment.trim() || commentingOn === post.id}
                      className="text-accent-primary disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-10 w-10 text-text-muted/20 mx-auto mb-3" />
          <p className="text-sm text-text-muted">
            Se el primero en compartir tu opinion
          </p>
        </div>
      )}
    </div>
  );
}
