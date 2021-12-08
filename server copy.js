const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const api = require('routes');

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

app.use(apiRoutes);

// GET Route for notes.html
app.get('/notes', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
	fs.writeFile(
		destination,
		JSON.stringify(content, null, 4),
		(err) => (err ? console.error(err) : console.info(`writeToFile:\nData written to ${destination}`))
	);

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
	fs.readFile(file, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
		} else {
			const parsedData = JSON.parse(data);
			parsedData.push(content);
			writeToFile(file, parsedData);
			console.log('inreadandappend, after writeTofile');
		}
	});
};

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
	console.info(`${req.method} request received for notes`);
	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
app.post('/api/notes', (req, res) => {
	console.info(`${req.method} request received to add a note`);

	const { title, text } = req.body;

	if (req.body) {
		const newNote = {
			title,
			text,
			id: uuid()
		};

		readAndAppend(newNote, './db/db.json');
		console.log('app.post api/notes,after readAndAppend');
		res.json(`Note added successfully 🚀`);
	} else {
		console.log('error condition');
		res.error('Error in adding note');
	}
});

// Look for the note with the passed in id and delete it.
app.delete('/api/notes/:id', (req, res) => {
	console.info(`${req.method} request received for notes id`);
	const noteId = req.params.id;
	// Promisify version of fs.readFile()
	readFromFile('./db/db.json')
		.then((data)=>JSON.parse(data))
		.then((json) => {
			// Make a new array of notes except the one with the ID that matches from the URL
			const result = json.filter((note)=>note.id !== (noteId));

			// Save that array to the filesystem
			writeToFile('./db/db.json', result);

			// Respond to the DELETE request
			res.json(`Item ${noteId} has been deleted 🗑️`);
		});
});


app.listen(PORT, () => console.log(`Notes App listening at http://localhost:${PORT} 🚀`));
