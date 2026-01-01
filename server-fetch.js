const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/stress-test', async (req, res) => {
    const url = req.query.url;
    const count = parseInt(req.query.count) || 10;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let completed = 0;
    let errors = 0;

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent({ type: 'start', total: count });

    // Helper to fetch once
    const fetchOnce = async () => {
        try {
            // Add timestamp to bypass cache
            const uniqueUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}_${Math.random()}`;
            
            const response = await axios.get(uniqueUrl, { 
                responseType: 'stream' 
            });

            // Consume stream
            await new Promise((resolve, reject) => {
                response.data.on('data', () => {});
                response.data.on('end', resolve);
                response.data.on('error', reject);
            });

            completed++;
            sendEvent({ type: 'progress', completed, errors, total: count });
        } catch (err) {
            errors++;
            completed++;
            sendEvent({ type: 'progress', completed, errors, total: count, error: err.message });
        }
    };

    // Run fetches sequentially to ensure stability
    for (let i = 0; i < count; i++) {
        await fetchOnce();
        // Small delay to prevent complete CPU hogging
        await new Promise(r => setTimeout(r, 10));
    }

    sendEvent({ type: 'done', completed, errors });
    res.end();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/server-fetch.html to run the test`);
});