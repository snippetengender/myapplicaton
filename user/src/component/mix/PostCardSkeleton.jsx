const PostCardSkeleton = () => {
  return (
    <div className="border-b border-gray-700 py-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start px-1">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full bg-neutral-700"></div>
          <div className="w-full space-y-2">
            <div className="h-4 rounded bg-neutral-700 w-1/4"></div>
            <div className="h-3 rounded bg-neutral-700 w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 mt-4 space-y-3">
        <div className="h-5 rounded bg-neutral-700 w-3/4"></div>
        <div className="w-full h-40 rounded-lg bg-neutral-700"></div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex justify-end items-center mt-4 px-4">
         <div className="w-24 h-8 rounded-full bg-neutral-700"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;