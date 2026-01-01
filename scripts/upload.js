const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get list of images
const imagesDir = path.join(__dirname, '..', 'images'); // Adjust path since script is in scripts/

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    rl.close();
    return;
  }

  const images = files.filter(file => file.endsWith('.jpg'));
  if (images.length === 0) {
    console.log('No images found in images/ directory.');
    rl.close();
    return;
  }

  console.log('Available images:');
  images.forEach((img, index) => console.log(`${index + 1}. ${img}`));

  rl.question('Enter the numbers of images to upload (comma separated, or "all"): ', (answer) => {
    let toUpload = [];
    if (answer.toLowerCase() === 'all') {
      toUpload = images;
    } else {
      const indices = answer.split(',').map(num => parseInt(num.trim()) - 1);
      toUpload = indices.filter(i => i >= 0 && i < images.length).map(i => images[i]);
    }

    if (toUpload.length === 0) {
      console.log('No valid images selected.');
      rl.close();
      return;
    }

    console.log(`Uploading ${toUpload.length} image(s)...`);

    let uploaded = 0;
    toUpload.forEach(img => {
      const imgPath = path.join(imagesDir, img);
      cloudinary.uploader.upload(imgPath, { public_id: img.replace('.jpg', '') }, (error, result) => {
        if (error) {
          console.error(`Error uploading ${img}:`, error.message);
        } else {
          console.log(`Uploaded ${img}: ${result.secure_url}`);
        }
        uploaded++;
        if (uploaded === toUpload.length) {
          console.log('All uploads completed.');
          rl.close();
        }
      });
    });
  });
});