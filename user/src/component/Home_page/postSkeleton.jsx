// src/components/PostCardSkeleton.js

const PostCardSkeleton = () => {
  return (
    <div className="border-b border-gray-800 p-4 animate-pulse">
      <div className="flex justify-between">
        <div className="flex items-start gap-3 w-full">
          {/* Avatar Skeleton */}
          <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          <div className="flex-1">
            {/* User Info Skeleton */}
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            {/* Content Skeleton */}
            <div className="h-4 bg-gray-700 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mt-2"></div>
          </div>
        </div>
      </div>
      {/* Stats/Buttons Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        <div className="flex gap-2">
          <div className="h-7 bg-gray-700 rounded-full w-16"></div>
          <div className="h-7 bg-gray-700 rounded-full w-16"></div>
          <div className="h-7 bg-gray-700 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;