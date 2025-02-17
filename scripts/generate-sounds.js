const fs = require('fs');
const { exec } = require('child_process');

// Since we can't use Web Audio API in Node, we'll use ffmpeg to generate tones
// Make sure ffmpeg is installed on your system

const generateTone = (filename, frequency, duration, fade = null) => {
  let command = `ffmpeg -f lavfi -i "sine=frequency=${frequency}:duration=${duration}"`;
  
  if (fade) {
    command += ` -af "afade=t=out:st=${fade.start}:d=${fade.duration}"`;
  }
  
  command += ` -acodec libmp3lame "${filename}"`;
  
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

// No-win sound - low C note (130.81 Hz) with quick fade out
generateTone('public/sounds/no-win.mp3', 130.81, 0.15, { start: 0.05, duration: 0.1 });

// Win sounds with increasing frequencies
generateTone('public/sounds/win-small.mp3', 523.25, 0.5);   // C5
generateTone('public/sounds/win-medium.mp3', 659.25, 0.75); // E5
generateTone('public/sounds/win-large.mp3', 783.99, 1);     // G5 