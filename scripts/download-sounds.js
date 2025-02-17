const https = require('https');
const fs = require('fs');
const path = require('path');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(process.cwd(), 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Sound effects from freesound.org (all Creative Commons licensed)
const sounds = {
  'card-slide.mp3': 'https://cdn.freesound.org/previews/240/240777_4107740-lq.mp3', // Card slide sound
  'hold.mp3': 'https://cdn.freesound.org/previews/270/270304_5123851-lq.mp3', // Button click sound
  'lose.mp3': 'https://cdn.freesound.org/previews/362/362205_6629250-lq.mp3', // Lose sound
  'win-small.mp3': 'https://cdn.freesound.org/previews/369/369925_6687669-lq.mp3', // Small win
  'win-medium.mp3': 'https://cdn.freesound.org/previews/369/369926_6687669-lq.mp3', // Medium win
  'win-large.mp3': 'https://cdn.freesound.org/previews/369/369927_6687669-lq.mp3', // Large win
};

const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(soundsDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

// Download all sounds
Promise.all(
  Object.entries(sounds).map(([filename, url]) => downloadFile(url, filename))
)
  .then(() => console.log('All sounds downloaded successfully!'))
  .catch((error) => console.error('Error downloading sounds:', error)); 