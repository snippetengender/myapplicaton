import { useDispatch } from "react-redux";
import { getPollTimeInfo } from "./GetPollTimeInfo";
import { voteInPoll } from "../../features/mixes/mixSlice";

export const PollComponent = ({ post, profileType, isCommentPage }) => {
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
    <>
      {!isCommentPage ? (
        <div className="mt-3 space-y-2">
          {/* Content */}
          {profileType === "user" && post.content && (
            <p className="text-brand-off-white text-[18px] whitespace-pre-line leading-[22px] mb-[17px]">
              {post.content}
            </p>
          )}
          {profileType === "network" && post.content && (
            <>
              <p className="text-brand-off-white text-[18px] font-bold mb-1 leading-[22px]">
                {post.title}
              </p>
              <p className="text-brand-off-white text-[12px] whitespace-pre-line leading-[15px]">
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
                  ? "cursor-pointer hover:border-brand-pink"
                  : "cursor-default"
              }
              ${isPollEnded && !hasVoted ? "opacity-50" : ""}
              ${isSelectedOption ? "border-brand-pink font-semibold" : "border-brand-charcoal font-medium"}`}
              >
                {/* Option Fill if Voted */}
                {hasVoted && (
                  <div
                    className="absolute top-0 left-0 h-full bg-brand-pink/20 border-brand-pink/20 transition-all duration-500"
                    style={{ width: `${option.votes}%` }}
                  />
                )}

                {/* Option Text */}
                <div className="relative flex items-center">
                  {/* {isSelectedOption && (
                    <span className="text-brand-pinborder-brand-pink mr-2">✓</span>
                  )} */}
                  <span className="text-[12px] text-brand-off-white leading-[15px]">{option.text}</span>
                </div>

                {/* Vote Count (only if voted) */}
                {hasVoted && (
                  <div className="relative flex items-center">
                    <span className="text-brand-off-white text-[12px] font-semibold">
                      {option.votes}%
                    </span>
                    {/* <span className="text-gray-500 text-xs">
                      ({option.count})
                    </span> */}
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer */}
          {/* <p className="text-xs text-center text-gray-500 pt-1">
            {isPollEnded
              ? pollTimeInfo.displayText
              : `${post.stats.reactions} ${
                  post.stats.reactions === 1 ? "vote" : "votes"
                } • ${pollTimeInfo.displayText}`}
          </p> */}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {/* Content */}
          {post.network_id === null && post.content && (
            <p className="text-brand-off-white text-[18px] whitespace-pre-line leading-[22px] mb-[17px]">
              {post.content}
            </p>
          )}
          {post.network_id !== null &&  post.content && (
            <>
              <p className="text-brand-off-white text-[18px] font-bold mb-1 leading-[22px]">
                {post.title}
              </p>
              <p className="text-brand-off-white text-[12px] whitespace-pre-line leading-[15px]">
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
                  ? "cursor-pointer hover:border-brand-pink"
                  : "cursor-default"
              }
              ${isPollEnded && !hasVoted ? "opacity-50" : ""}
              ${isSelectedOption ? "border-brand-pink" : "border-brand-charcoal"}`}
              >
                {/* Option Fill if Voted */}
                {hasVoted && (
                  <div
                    className="absolute top-0 left-0 h-full bg-brand-pink/20 border-brand-pink/20 transition-all duration-500"
                    style={{ width: `${option.votes}%` }}
                  />
                )}

                {/* Option Text */}
                <div className="relative flex items-center">
                  {/* {isSelectedOption && (
                    <span className="text-brand-pinborder-brand-pink mr-2">✓</span>
                  )} */}
                  <span className="text-[12px] text-brand-off-white leading-[15px]">{option.text}</span>

                </div>

                {/* Vote Count (only if voted) */}
                {hasVoted && (
                  <div className="relative flex items-center">
                    <span className="text-brand-off-white text-[12px] font-semibold">
                      {option.votes}%
                    </span>
                    {/* <span className="text-gray-500 text-xs">
                      ({option.count})
                    </span> */}
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer */}
          {/* <p className="text-xs text-center text-gray-500 pt-1">
            {isPollEnded
              ? pollTimeInfo.displayText
              : `${post.stats.reactions} ${
                  post.stats.reactions === 1 ? "vote" : "votes"
                } • ${pollTimeInfo.displayText}`}
          </p> */}
        </div>
      )}
    </>
  );
};
