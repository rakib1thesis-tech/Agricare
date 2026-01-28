
import React, { useState } from 'react';

interface Comment {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, name: "Abdur Rashid", rating: 5, text: "The management alerts are a game changer. I knew exactly when to irrigate my Bogura potato field.", date: "2 days ago" },
    { id: 2, name: "Fatema Begum", rating: 4, text: "Great tool for fertilizer calculation. Saved me a lot of money on over-fertilizing during the rainy season.", date: "1 week ago" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !userName) return;
    
    const comment: Comment = {
      id: Date.now(),
      name: userName,
      rating,
      text: newComment,
      date: "Just now"
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
    setUserName("");
    setRating(5);
  };

  return (
    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Farmer Community Feedback</h2>
          <p className="text-slate-500">Share your experience with the Agricare platform.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-12">
          <h3 className="text-xl font-bold mb-6">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="e.g. Kamal Hossain"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-slate-200'}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Your Comments</label>
              <textarea 
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="How has Agricare helped your farm in Bangladesh?"
              ></textarea>
            </div>
            <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              Submit Review
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{c.date}</div>
                </div>
                <div className="flex gap-1 text-yellow-400 text-sm">
                  {[...Array(c.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">"{c.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
