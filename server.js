const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const {readFromFile, writeToFile, readAndAppend } = require ("./helpers/fsUtils");

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
// Must add the process.env.port for Heroku
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Allows a static folder to be available to respond with, like index.html and notes.html. For security
app.use(express.static('public'));

//defining routes
const apiRoutes = require('./routes/apiRoutes');

app.use('/api', apiRoutes);

const htmlRoutes = require('./routes/htmlRoutes');
// This **must** be last because it uses the '*' wildcard.
app.use(htmlRoutes);

app.listen(PORT, () => console.log(`Notes App listening at http://localhost:${PORT} 🚀`));
