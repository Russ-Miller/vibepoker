const https = require('https');
const fs = require('fs');
const path = require('path');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(process.cwd(), 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Sound effects from mixkit.co (free for commercial use)
const sounds = {
  'card-slide.mp3': 'https://assets.mixkit.co/active_storage/sfx/2356/2356-preview.mp3',
  'hold.mp3': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  'lose.mp3': 'https://assets.mixkit.co/active_storage/sfx/2960/2960-preview.mp3',
  'win-small.mp3': 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  'win-medium.mp3': 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  'win-large.mp3': 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',
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