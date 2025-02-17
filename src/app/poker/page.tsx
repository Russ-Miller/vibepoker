"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PlayingCard from "../components/PlayingCard";
import PayoutTable from "../components/PayoutTable";
import { playSound, playWinSound, toggleSound, isSoundOn } from "@/lib/utils/sounds";
import { Volume2, VolumeX } from "lucide-react";

type Card = {
  suit: "♠" | "♥" | "♦" | "♣";
  value: string;
  held: boolean;
};

type Hand = Card[];

const CARD_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default function PokerGame() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Hand>([]);
  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(1);
  const [gamePhase, setGamePhase] = useState<"betting" | "holding">("betting");
  const [lastWin, setLastWin] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to home");
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const newDeck = initializeDeck();
      setDeck(newDeck);
      // Initialize with empty placeholders
      setHand(Array(5).fill({ suit: "♠", value: "", held: false }));
    }
  }, [user]);

  const initializeDeck = () => {
    const suits: ("♠" | "♥" | "♦" | "♣")[] = ["♠", "♥", "♦", "♣"];
    const newDeck: Card[] = [];

    for (const suit of suits) {
      for (const value of CARD_VALUES) {
        newDeck.push({ suit, value, held: false });
      }
    }

    // Fisher-Yates shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  };

  const dealHand = () => {
    if (credits < bet) {
      alert("Not enough credits!");
      return;
    }

    playSound("deal");
    setCredits(credits - bet);
    const newHand = deck.slice(0, 5).map(card => ({ ...card, held: false }));
    setHand(newHand);
    setDeck(deck.slice(5));
    setGamePhase("holding");
    setLastWin(0);
  };

  const toggleHold = (index: number) => {
    if (gamePhase !== "holding") return;
    playSound("hold");
    const newHand = [...hand];
    newHand[index] = { ...newHand[index], held: !newHand[index].held };
    setHand(newHand);
  };

  const drawNewCards = () => {
    const newHand = hand.map((card, index) => {
      if (card.held) return card;
      const newCard = deck[index];
      return { ...newCard, held: false };
    });

    setHand(newHand);
    setDeck(deck.slice(5));
    setGamePhase("betting");

    // Evaluate hand and award credits
    const winnings = evaluateHand(newHand) * bet;
    if (winnings > 0) {
      setLastWin(winnings);
      playWinSound(winnings);
      setCredits(prev => prev + winnings);
    } else {
      setLastWin(0);
      playWinSound(0); // Explicitly play the lose sound when no payout
    }

    if (deck.length < 10) {
      setDeck(initializeDeck());
    }
  };

  const evaluateHand = (hand: Hand): number => {
    const values = hand.map(card => card.value);
    const suits = hand.map(card => card.suit);
    const valueCounts: { [key: string]: number } = {};
    
    // Count occurrences of each value
    for (const value of values) {
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    const valueEntries = Object.entries(valueCounts);
    const isFlush = suits.every(suit => suit === suits[0]);
    
    // Check for straight
    const valueIndices = values.map(v => CARD_VALUES.indexOf(v)).sort((a, b) => a - b);
    const isSequential = valueIndices.every((val, i) => 
      i === 0 || valueIndices[i - 1] === val - 1
    );
    const isStraight = isSequential || 
      // Special case for Ace-low straight (A,2,3,4,5)
      (valueIndices[4] === 12 && valueIndices[0] === 0 && valueIndices[1] === 1 && 
       valueIndices[2] === 2 && valueIndices[3] === 3);

    // Royal Flush
    if (isFlush && isStraight && values.includes("A") && values.includes("K")) {
      return 250;
    }
    
    // Straight Flush
    if (isFlush && isStraight) {
      return 50;
    }

    // Four of a Kind
    if (valueEntries.some(([_, count]) => count === 4)) {
      return 25;
    }

    // Full House
    if (valueEntries.some(([_, count]) => count === 3) && 
        valueEntries.some(([_, count]) => count === 2)) {
      return 9;
    }

    // Flush
    if (isFlush) {
      return 6;
    }

    // Straight
    if (isStraight) {
      return 4;
    }

    // Three of a Kind
    if (valueEntries.some(([_, count]) => count === 3)) {
      return 3;
    }

    // Two Pair
    if (valueEntries.filter(([_, count]) => count === 2).length === 2) {
      return 2;
    }

    // Jacks or Better
    for (const [value, count] of valueEntries) {
      if (count === 2 && ["J", "Q", "K", "A"].includes(value)) {
        return 1;
      }
    }

    return 0;
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="text-2xl text-white">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-black text-white">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Jacks or Better Video Poker
            </h1>
            <p className="text-sm text-gray-400">Welcome, {user.email}</p>
          </div>
          <div className="space-x-6 flex items-center">
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg transition-all duration-200 ${
                soundEnabled 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              title={soundEnabled ? "Sound On" : "Sound Off"}
            >
              {soundEnabled ? (
                <Volume2 size={24} className="animate-pulse" />
              ) : (
                <VolumeX size={24} />
              )}
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Credits: {credits}
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex justify-center space-x-4 my-12">
              {hand.map((card, index) => (
                <PlayingCard
                  key={index}
                  value={card.value}
                  suit={card.suit}
                  held={card.held}
                  empty={!card.value}
                  onClick={() => toggleHold(index)}
                />
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setBet(Math.max(1, bet - 1))}
                disabled={gamePhase === "holding"}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Bet -
              </button>
              <span className="px-6 py-3 font-bold text-2xl text-yellow-400">Bet: {bet}</span>
              <button
                onClick={() => setBet(Math.min(5, bet + 1))}
                disabled={gamePhase === "holding"}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Bet +
              </button>
              <button
                onClick={gamePhase === "betting" ? dealHand : drawNewCards}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xl min-w-[120px]"
              >
                {gamePhase === "betting" ? "Deal" : "Draw"}
              </button>
            </div>
          </div>

          <PayoutTable currentBet={bet} lastWin={lastWin} />
        </div>
      </div>
    </main>
  );
} 