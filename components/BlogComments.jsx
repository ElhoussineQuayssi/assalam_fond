"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Reply } from "lucide-react";
import { useAppData } from "./AppDataContext";

const BlogComments = ({ postId }) => {
  const { blogs, addComment } = useAppData();
  const post = blogs.find(p => p.id == postId);
  const comments = post?.comments || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hours < 1) return "الآن";
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-MA');
  };
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [visibleComments, setVisibleComments] = useState(2);
  const [newlyLoaded, setNewlyLoaded] = useState(new Set());

  const sectionRef = useRef(null);

  useEffect(() => {
    // Fix: Use gsap.fromTo to ensure opacity ends at 1
    gsap.fromTo(".comment-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  useEffect(() => {
    if (newlyLoaded.size > 0) {
      gsap.fromTo(".new-comment",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          onComplete: () => setNewlyLoaded(new Set())
        }
      );
    }
  }, [visibleComments]);

  const handleAddComment = async () => {
    if (newComment.trim() && name.trim() && email.trim()) {
      await addComment({
        post_id: postId,
        name,
        email,
        text: newComment,
        parent_id: null,
        created_at: new Date().toISOString()
      });
      setNewComment("");
      setName("");
      setEmail("");
    }
  };

  const handleReply = (parentId) => {
    if (replyText.trim()) {
      const newId = Date.now();
      setComments([...comments, {
        id: newId,
        name: "أنت",
        date: "الآن",
        text: replyText,
        parentId
      }]);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  const loadMore = () => {
    const newVisible = Math.min(visibleComments + 2, comments.filter(c => c.parent_id === null).length);
    const newIds = comments.filter(c => c.parent_id === null).slice(visibleComments, newVisible).map(c => c.id);
    setNewlyLoaded(new Set([...newlyLoaded, ...newIds]));
    setVisibleComments(newVisible);
  };

  return (
    <section ref={sectionRef} className="max-w-4xl mx-auto py-20 px-4 relative z-10">
      <div className="flex items-center gap-3 mb-12">
        <MessageSquare className="text-blue-600" />
        <h3 className="text-3xl font-black text-slate-900">الآراء والمناقشات</h3>
      </div>

      {/* --- Comment Input Card --- */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم الكامل"
            className="rounded-xl border-none bg-slate-50 shadow-sm h-12 focus-visible:ring-blue-500"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="البريد الإلكتروني"
            className="rounded-xl border-none bg-slate-50 shadow-sm h-12 focus-visible:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 mb-6">
          <Avatar className="h-12 w-12 border-2 border-blue-100">
            <AvatarImage src="/current-user.jpg" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="شاركنا رأيك في هذا الموضوع..."
              className="w-full border-none bg-slate-50 rounded-2xl p-4 focus-visible:ring-blue-500 min-h-[120px] text-slate-800 opacity-100"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            نشر التعليق
          </Button>
        </div>
      </div>

      {/* --- Comments Feed --- */}
      <div className="space-y-6">
        {comments.filter(c => c.parent_id === null).slice(0, visibleComments).map((comment) => (
          <div key={comment.id}>
            <div className={`comment-card bg-slate-50/50 backdrop-blur-sm border border-white p-6 rounded-[2rem] flex gap-5 ${newlyLoaded.has(comment.id) ? 'new-comment' : ''}`}>
              <Avatar className="h-14 w-14 shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.name}`} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-900 text-lg">{comment.name}</h4>
                  <span className="text-xs text-slate-400 font-medium">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm mb-4">
                  {comment.text}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  رد
                </Button>
              </div>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="ml-20 mt-4 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                <div className="flex gap-4 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-blue-100">
                    <AvatarImage src="/current-user.jpg" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="اكتب ردك..."
                    className="flex-1 border-none bg-slate-50 rounded-2xl p-4 focus-visible:ring-blue-500 min-h-[80px] text-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setReplyingTo(null)}
                    className="rounded-full"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={() => handleReply(comment.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                  >
                    رد
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {getReplies(comment.id).map((reply) => (
              <div key={reply.id} className="ml-20 mt-4 comment-card bg-slate-50/30 backdrop-blur-sm border border-white p-4 rounded-[1.5rem] flex gap-4">
                <Avatar className="h-10 w-10 shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.name}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-slate-900 text-sm">{reply.name}</h5>
                    <span className="text-xs text-slate-400 font-medium">{formatDate(reply.created_at)}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {reply.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        {visibleComments < comments.filter(c => c.parent_id === null).length && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMore}
              variant="outline"
              className="rounded-full px-8 h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              تحميل المزيد
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogComments;