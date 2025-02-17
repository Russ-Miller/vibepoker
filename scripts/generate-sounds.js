const fs = require('fs');
const { exec } = require('child_process');

// Since we can't use Web Audio API in Node, we'll use ffmpeg to generate tones
// Make sure ffmpeg is installed on your system

const generateTone = (filename, frequency, duration) => {
  const command = `ffmpeg -f lavfi -i "sine=frequency=${frequency}:duration=${duration}" -acodec libmp3lame "${filename}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating ${filename}:`, error);
      return;
    }
    console.log(`Generated ${filename}`);
  });
};

// Create sounds directory if it doesn't exist
if (!fs.existsSync('public/sounds')) {
  fs.mkdirSync('public/sounds', { recursive: true });
}

// Generate sound files
generateTone('public/sounds/deal.mp3', 440, 0.1);  // A4 note, short
generateTone('public/sounds/hold.mp3', 880, 0.05); // A5 note, very short

// Win sounds with increasing frequencies
generateTone('public/sounds/win-small.mp3', 523.25, 0.5);   // C5
generateTone('public/sounds/win-medium.mp3', 659.25, 0.75); // E5
generateTone('public/sounds/win-large.mp3', 783.99, 1);     // G5 