"use client";

interface PayoutTableProps {
  currentBet: number;
  lastWin?: number;
  currentHandMultiplier?: number;
  onToggleSound?: () => void;
  soundEnabled?: boolean;
}

const PAYOUTS = [
  { hand: "Royal Flush", multiplier: 250 },
  { hand: "Straight Flush", multiplier: 50 },
  { hand: "Four of a Kind", multiplier: 25 },
  { hand: "Full House", multiplier: 9 },
  { hand: "Flush", multiplier: 6 },
  { hand: "Straight", multiplier: 4 },
  { hand: "Three of a Kind", multiplier: 3 },
  { hand: "Two Pair", multiplier: 2 },
  { hand: "Jacks or Better", multiplier: 1 },
];

export default function PayoutTable({ currentBet, lastWin, currentHandMultiplier, onToggleSound, soundEnabled }: PayoutTableProps) {
  return (
    <div className="w-full max-w-sm bg-gray-900 rounded-lg border border-gray-700 overflow-hidden relative">
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Payouts</h2>
        {lastWin ? (
          <div className="text-xl font-bold text-yellow-400">
            Win: {lastWin} credits!
          </div>
        ) : null}
      </div>
      <div className="divide-y divide-gray-700">
        {PAYOUTS.map(({ hand, multiplier }) => (
          <div
            key={hand}
            className={`flex justify-between items-center p-3 hover:bg-gray-800 transition-colors
              ${currentHandMultiplier === multiplier ? 'bg-gray-800' : ''}`}
          >
            <div className="flex items-center w-48">
              <div className="w-6 flex-shrink-0">
                {currentHandMultiplier === multiplier && (
                  <span className="text-yellow-400 animate-pulse">▶</span>
                )}
              </div>
              <span className="text-white">{hand}</span>
            </div>
            <span className={`font-bold ${currentHandMultiplier === multiplier ? 'text-yellow-400' : 'text-gray-400'}`}>
              {multiplier * currentBet}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 