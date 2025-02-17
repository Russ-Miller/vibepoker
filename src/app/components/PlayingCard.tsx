"use client";

import { Music2, Waves } from "lucide-react";

interface PlayingCardProps {
  value: string;
  suit: "♠" | "♥" | "♦" | "♣";
  held: boolean;
  onClick: () => void;
  empty?: boolean;
}

export default function PlayingCard({ value, suit, held, onClick, empty = false }: PlayingCardProps) {
  const isRed = suit === "♥" || suit === "♦";

  if (empty) {
    return (
      <div
        className="w-32 h-48 rounded-xl border-2 border-indigo-300 cursor-pointer transition-all duration-200
          bg-gradient-to-br from-indigo-600 to-indigo-900 relative overflow-hidden
          hover:shadow-[0_0_15px_rgba(129,140,248,0.5)]"
      >
        {/* Ornate border */}
        <div className="absolute inset-2 border-2 border-indigo-300/30 rounded-lg"></div>
        
        {/* Corner flourishes */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-300/30"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-300/30"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-300/30"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-300/30"></div>

        {/* Diamond pattern background */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1 p-4 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="aspect-square rotate-45 border border-white/40"></div>
          ))}
        </div>

        {/* Music note pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="text-white flex items-center justify-center">
                {i % 2 === 0 ? <Music2 size={16} /> : <Waves size={16} />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Center medallion */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400/20 to-indigo-600/20
            flex items-center justify-center border border-indigo-300/30 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-2 border-indigo-300/30 flex items-center justify-center">
              <div className="text-white/90 font-bold text-2xl tracking-wider">VP</div>
            </div>
          </div>
        </div>

        {/* Diagonal stripes */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-[200%] w-px bg-white transform -rotate-45"
              style={{ left: `${i * 20}%`, top: '-50%' }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`w-32 h-48 rounded-xl border-2 relative cursor-pointer transition-all duration-200
        ${held ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-gray-300"}
        ${isRed ? "text-red-600" : "text-gray-900"}
        hover:border-blue-400
        bg-white
      `}
    >
      {/* Top left value and suit */}
      <div className="absolute top-2 left-2 flex flex-col items-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-2xl">{suit}</div>
      </div>

      {/* Center large suit */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl opacity-20">{suit}</div>
      </div>

      {/* Bottom right value and suit (inverted) */}
      <div className="absolute bottom-2 right-2 flex flex-col items-center rotate-180">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-2xl">{suit}</div>
      </div>

      {/* HELD indicator */}
      {held && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-blue-500 text-white px-4 py-1 rounded-lg text-lg font-bold
          shadow-lg border border-blue-400">
          HELD
        </div>
      )}
    </div>
  );
} 