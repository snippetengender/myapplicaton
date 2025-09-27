// Create a new file, e.g., components/skeletons/CommentsPageSkeleton.jsx
import PostCardSkeleton from "./PostCardSkeleton";
import CommentSkeleton from "./CommentsSkeleton";

const CommentsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 flex flex-col w-full max-w-2xl mx-auto">
      {/* Page Header Skeleton */}
      <div className="flex items-center mb-6 animate-pulse">
        <div className="h-6 w-6 rounded bg-neutral-700 mr-4"></div>
        <div className="w-10 h-10 rounded-full bg-neutral-700 mr-3"></div>
        <div className="flex flex-col w-1/2 space-y-2">
           <div className="h-5 rounded bg-neutral-700 w-full"></div>
           <div className="h-4 rounded bg-neutral-700 w-1/3"></div>
        </div>
      </div>

      {/* Post Card Skeleton */}
      <div>
        <PostCardSkeleton />
      </div>

      {/* Comments Section Skeleton */}
      <div className="flex-grow overflow-y-auto pb-24 mt-4">
        <div className="h-7 w-1/4 rounded bg-neutral-700 mb-4 animate-pulse"></div>
        <div className="w-full h-24 rounded-lg bg-neutral-800 mb-6 animate-pulse"></div>
        
        {/* Render a few comment skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CommentsPageSkeleton;