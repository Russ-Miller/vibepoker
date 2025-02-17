"use client";

let SOUNDS: {
  cardSlide: HTMLAudioElement;
  hold: HTMLAudioElement;
  lose: HTMLAudioElement;
  win: {
    small: HTMLAudioElement;
    medium: HTMLAudioElement;
    large: HTMLAudioElement;
  };
} | null = null;

let isSoundEnabled = true;

// Initialize sounds only on client side
if (typeof window !== "undefined") {
  try {
    SOUNDS = {
      cardSlide: new Audio("/sounds/card-slide.mp3"),
      hold: new Audio("/sounds/hold.mp3"),
      lose: new Audio("/sounds/lose.mp3"),
      win: {
        small: new Audio("/sounds/win-small.mp3"),
        medium: new Audio("/sounds/win-medium.mp3"),
        large: new Audio("/sounds/win-large.mp3"),
      },
    };

    // Pre-load all sounds and set appropriate volumes
    Object.values(SOUNDS).forEach(sound => {
      if (sound instanceof Audio) {
        sound.load();
        // Set volume for specific sounds
        if (sound === SOUNDS?.cardSlide) {
          sound.volume = 0.3; // Softer card slide
          sound.playbackRate = 1.2; // Slightly faster card slide
        } else if (sound === SOUNDS?.hold) {
          sound.volume = 0.4; // Moderate button click
        } else if (sound === SOUNDS?.lose) {
          sound.volume = 0.5; // Clear lose sound
        }
      } else if (typeof sound === 'object') {
        Object.values(sound).forEach(s => {
          s.load();
          s.volume = 0.6; // Win sounds slightly louder
        });
      }
    });
  } catch (error) {
    console.error("Failed to initialize sounds:", error);
  }
}

export const toggleSound = () => {
  isSoundEnabled = !isSoundEnabled;
  return isSoundEnabled;
};

const playCardSlide = (delay: number = 0) => {
  if (!SOUNDS) return;
  
  const sound = new Audio("/sounds/card-slide.mp3");
  sound.volume = 0.3;
  sound.playbackRate = 1.2;
  
  setTimeout(() => {
    sound.play().catch(() => {
      // Ignore autoplay errors
    });
  }, delay);
};

export const playSound = (sound: "deal" | "hold") => {
  if (!isSoundEnabled || !SOUNDS) return;
  
  try {
    if (sound === "deal") {
      // Play multiple card slides with shorter delays for snappier dealing
      for (let i = 0; i < 5; i++) {
        playCardSlide(i * 80); // 80ms delay between each card (faster than before)
      }
    } else {
      const audioElement = SOUNDS[sound];
      audioElement.currentTime = 0;
      const playPromise = audioElement.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Ignore autoplay errors
        });
      }
    }
  } catch (error) {
    console.error(`Error playing ${sound} sound:`, error);
  }
};

export const playWinSound = (amount: number) => {
  if (!isSoundEnabled || !SOUNDS) return;

  try {
    let sound;
    if (amount > 0) {
      if (amount >= 100) {
        sound = SOUNDS.win.large;
      } else if (amount >= 25) {
        sound = SOUNDS.win.medium;
      } else {
        sound = SOUNDS.win.small;
      }
      // For wins, let previous sounds finish (don't reset currentTime)
      // This creates a more celebratory feel for wins
      const playPromise = sound.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Ignore autoplay errors
        });
      }
    } else {
      // Play lose sound when amount is 0
      sound = SOUNDS.lose;
      sound.currentTime = 0; // Reset lose sound to start
      const playPromise = sound.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Ignore autoplay errors
        });
      }
    }
  } catch (error) {
    console.error("Error playing win/lose sound:", error);
  }
};

export const isSoundOn = () => isSoundEnabled; 