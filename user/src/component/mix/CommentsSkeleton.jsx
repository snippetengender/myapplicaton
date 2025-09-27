const CommentSkeleton = () => {
  return (
    <div className="flex items-start mt-4 animate-pulse">
      <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-neutral-700"></div>
      <div className="flex-grow min-w-0">
        <div className="h-4 rounded bg-neutral-700 w-1/3"></div>
        <div className="h-4 mt-2 rounded bg-neutral-700 w-2/3"></div>
      </div>
    </div>
  );
};

export default CommentSkeleton;