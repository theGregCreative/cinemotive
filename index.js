const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
    res.send('CineMotive Video Upload Service');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
