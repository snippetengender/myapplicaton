import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SendBouquetPage() {
  const navigate = useNavigate();

  // Demo data — comment these arrays out to show the "empty state"
  const someoneSaidThat = [
    {
      type: "prompt", // normal prompt
      text: "You walk in like a CEO, and I’m just here trying to apply for a position in your life",
      time: "2h",
    },
    {
      type: "liked", // liked prompt
      text: '"Your dedication to fitness isn\'t just about looks - it\'s about the strength and discipline that radiates from within. You\'re truly inspiring."',
      time: "7w",
    },
  ];

  const realHappiness = [
    {
      text: `<sam> liked the prompt sent - "There's something magical about the way you ..."`,
      time: "5d",
    },
    {
      text: `<sreeleela> liked the prompt sent - I never knew music could feel so personal until ...`,
      time: "3w",
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white px-2 py-4">
      {/* Back button */}
      <ArrowLeft className="w-6 h-6 mb-4" onClick={() => navigate("/home")} />

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        Send <span style={{ color: "#F06CB7" }}>bouquet</span>
      </h1>
      <p
        className="text-gray-300 text-sm mb-4"
        style={{ color: "#E7E9EA", width: "95%" }}
      >
        This feature allows you to express your affection or positive feelings
        towards someone you don't know very well.
      </p>
      <p
        className="text-blue-500 text-sm mb-4"
        style={{ textAlign: "justify" }}
        onClick={() => navigate("/findem")}
      >
        find them here and throw it anonymously
      </p>

      {/* Someone Said That */}
      <h2 className="text-lg font-bold mb-1">Someone said that</h2>
      {someoneSaidThat.length === 0 ? (
        <p className="text-gray-300 text-sm mb-4">
          Stay excited, We can't wait to surprise you with beautiful bouquets
          coming your way.
        </p>
      ) : (
        <>
          {someoneSaidThat.map((item, idx) => (
            <p
              key={idx}
              className="text-gray-200 text-sm mb-2 border-b border-gray-700 pb-2"
            >
              {item.type === "liked" && (
                <span className="text-pink-500">♡ </span>
              )}
              {item.text}
              <span className="text-gray-400 text-[10px] ml-1">• {item.time}</span>
            </p>
          ))}
          <p
            className="text-blue-500 text-sm mb-4"
            onClick={() => navigate("/someonesaidthat")}
          >
            and you got more
          </p>
        </>
      )}

      {/* Note */}
      {someoneSaidThat.length !== 0 && (
        <p className="text-gray-300 text-sm mb-4">
          Note: Double tap the prompt to to like it. This simple gesture means a
          lot to the person who shared it.
        </p>
      )}

      {/* Real Happiness */}
      <div className="py-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Real Happiness</h3>
          {realHappiness.length !== 0 && (
            <span className="text-gray-500 text-xs" onClick={() => navigate("/wannahide")}>wanna hide this ?</span>
          )}
        </div>

        {realHappiness.length === 0 ? (
          <p className="text-gray-300 text-sm mb-2">
            You haven't sent a single prompt yet, and that's okay or if you've
            already sent it to someone, just be patient. We'll notify you when
            someone likes it.
          </p>
        ) : (
          <>
            {realHappiness.map((item, idx) => (
              <p
                key={idx}
                className="text-gray-200 text-sm mb-2 border-b border-gray-700 pb-2"
              >
                {item.text}{" "}
                <span className="text-gray-400 text-[10px]">• {item.time}</span>
              </p>
            ))}
            <p
              className="text-blue-500 text-sm mt-2"
              onClick={() => navigate("/realhappyness")}
            >
              and you got more
            </p>
          </>
        )}
      </div>
    </div>
  );
}
