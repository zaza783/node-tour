const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const dbURI = process.env.MONGODB_OFFLINE;

mongoose.connect(dbURI)
.then(() => console.log("Connected to mongodb database..."))
.catch((err) => console.log("Could not connect to mongodb database..."));


// middleware function
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// endpoints 
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/tours', tourRoutes);


// Router handler
app.get('/',  (req, res) => {
    res.send('Welcome to  node.js  tutorial');
});

const port = process.env.PORT;
app.listen(port, () => {
   console.log(`Listening on port ${port}...`);
});




