export function CommentLoadingDots() {
  return (
    <>
      <style>{`
        @keyframes comment-wave {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-12px); }
        }
        .comment-dot {
          animation: comment-wave 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="flex items-center justify-center gap-3 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="comment-dot inline-block h-3 w-3 rounded-full"
            style={{
              backgroundColor: '#6201E0',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
