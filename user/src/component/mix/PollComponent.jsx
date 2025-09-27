import { useDispatch } from "react-redux";
import { getPollTimeInfo } from "./GetPollTimeInfo";
import {
  voteInPoll,
} from "../../features/mixes/mixSlice";


export const PollComponent = ({ post, profileType }) => {
  const dispatch = useDispatch();

  const hasVoted = !!post.userVote;
  const pollTimeInfo = getPollTimeInfo(post.createdAt);

  const isPollEnded = pollTimeInfo.status === "ended";

  const handleVote = (optionId) => {
    if (isPollEnded) return;
    if (post.userVote === optionId) return;
    dispatch(voteInPoll({ mixId: post.id, optionId }));
  };

  return (
    <div className="mt-3 space-y-3">
      {/* Content */}
      {profileType === "user" && post.content && (
        <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
          {post.content}
        </p>
      )}
      {profileType === "network" && post.content && (
        <>
          <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
            {post.title}
          </p>
          <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
            {post.content}
          </p>
        </>
      )}

      {/* Poll Options */}
      {post.options.map((option) => {
        const isSelectedOption = post.userVote === option.id;

        return (
          <div
            key={option.id}
            onClick={() => handleVote(option.id)}
            className={`relative border rounded-xl p-3 flex justify-between items-center transition-all duration-200 overflow-hidden 
              ${
                !isPollEnded
                  ? "cursor-pointer hover:border-pink-500"
                  : "cursor-default"
              }
              ${isPollEnded && !hasVoted ? "opacity-50" : ""}
              ${isSelectedOption ? "border-pink-500" : "border-gray-700"}`}
          >
            {/* Option Fill if Voted */}
            {hasVoted && (
              <div
                className="absolute top-0 left-0 h-full bg-pink-500/20 transition-all duration-500"
                style={{ width: `${option.votes}%` }}
              />
            )}

            {/* Option Text */}
            <div className="relative flex items-center">
              {isSelectedOption && (
                <span className="text-pink-500 mr-2">✓</span>
              )}
              <span className="font-semibold">{option.text}</span>
            </div>

            {/* Vote Count (only if voted) */}
            {hasVoted && (
              <div className="relative flex items-center">
                <span className="text-gray-300 mr-2 font-bold">
                  {option.votes}%
                </span>
                <span className="text-gray-500 text-xs">({option.count})</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <p className="text-xs text-center text-gray-500 pt-1">
        {isPollEnded
          ? pollTimeInfo.displayText
          : `${post.stats.reactions} ${
              post.stats.reactions === 1 ? "vote" : "votes"
            } • ${pollTimeInfo.displayText}`}
      </p>
    </div>
  );
};