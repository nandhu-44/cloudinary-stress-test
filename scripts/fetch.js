const fs = require('fs');
const axios = require('axios');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const urlsFile = path.join(__dirname, '..', 'urls.txt');

fs.readFile(urlsFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading urls.txt:', err);
    rl.close();
    return;
  }

  const urls = data.trim().split('\n').filter(url => url);
  if (urls.length === 0) {
    console.log('No URLs found in urls.txt');
    rl.close();
    return;
  }

  console.log(`Found ${urls.length} URLs:`, urls.map((url, i) => `${i+1}. ${url}`).join('\n'));

  rl.question('How many times to fetch each URL? ', (timesStr) => {
    const times = parseInt(timesStr);
    if (isNaN(times) || times <= 0) {
      console.log('Invalid number');
      rl.close();
      return;
    }

    let totalFetches = urls.length * times;
    let completed = 0;
    console.log(`Starting ${totalFetches} fetches...`);

    for (let i = 0; i < urls.length; i++) {
      for (let j = 0; j < times; j++) {
        axios.get(urls[i], { responseType: 'stream' })
          .then(response => {
            // Consume the stream to simulate full download
            response.data.on('data', () => {}); // Do nothing, just consume
            response.data.on('end', () => {
              completed++;
              console.log(`Fetched ${urls[i]} (${completed}/${totalFetches})`);
              if (completed === totalFetches) {
                console.log('All fetches completed.');
                rl.close();
              }
            });
          })
          .catch(error => {
            console.error(`Error fetching ${urls[i]}:`, error.message);
            completed++;
            if (completed === totalFetches) {
              console.log('All fetches completed (with errors).');
              rl.close();
            }
          });
      }
    }
  });
});