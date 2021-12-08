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

app.use(express.static('public'));

//defining routes
const apiRoutes = require('./routes/apiRoutes');

// app.use(apiRoutes);
app.use('/api', apiRoutes);



// GET Route for retrieving all the notes
// app.get('/api/notes', (req, res) => {
// 	console.info(`${req.method} request received for notes`);
// 	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
// });

// POST Route for a new note
// app.post('/api/notes', (req, res) => {
// 	console.info(`${req.method} request received to add a note`);

// 	const { title, text } = req.body;

// 	if (req.body) {
// 		const newNote = {
// 			title,
// 			text,
// 			id: uuid()
// 		};

// 		readAndAppend(newNote, './db/db.json');
// 		console.log('app.post api/notes,after readAndAppend');
// 		res.json(`Note added successfully 🚀`);
// 	} else {
// 		console.log('error condition');
// 		res.error('Error in adding note');
// 	}
// });
// 

const htmlRoutes = require('./routes/htmlRoutes');
// This **must** be last because it uses the '*' wildcard.
app.use(htmlRoutes);

app.listen(PORT, () => console.log(`Notes App listening at http://localhost:${PORT} 🚀`));
