const express = require('express');
const cors = require('cors');
const storyRoutes = require('./routes/storyRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', storyRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});