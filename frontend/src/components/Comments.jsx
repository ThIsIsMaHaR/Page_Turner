import { useState, useEffect } from "react";
import api from "../api/axios";

const Comments = ({ novelId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  // Comments fetch karne ka function
  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/novels/${novelId}/comments`);
      setComments(data.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [novelId]);

  // Comment post karne ka handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(`/novels/${novelId}/comments`, 
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchComments(); // List update karo
    } catch (err) {
      alert("Something went wrong. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 text-left border-t border-border pt-12 max-w-3xl">
      <h3 className="text-2xl font-heading text-text-h mb-8 flex items-center gap-3">
        Reader Reviews
        <span className="text-sm font-mono opacity-50 bg-code-bg px-2 py-1 rounded">
          {comments.length}
        </span>
      </h3>
      
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <textarea 
            className="w-full bg-code-bg border border-border p-4 rounded-xl text-text outline-none focus:border-accent min-h-[100px] transition-all"
            placeholder="Write your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button 
              disabled={loading}
              className="bg-accent text-white px-8 py-2 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-4 bg-code-bg/50 border border-border rounded-xl text-center text-sm">
          Please <a href="/login" className="text-accent font-bold underline">Login</a> to leave a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="group border-b border-border/50 pb-6 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-text-h text-sm uppercase tracking-wide">
                  {comment.user?.name || "Anonymous Reader"}
                </span>
                <span className="text-[10px] font-mono opacity-40">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-text leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-text italic opacity-60">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;