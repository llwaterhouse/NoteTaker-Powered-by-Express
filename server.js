const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// GET Route for notes.html
app.get('/notes', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET Route for feedback page
// app.get('/feedback', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
// );

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

// GET Route for retrieving all the feedback
// app.get('/api/feedback', (req, res) => {
//   console.info(`${req.method} request received for feedback`);

//   readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)));
// });

// POST Route for submitting feedback
// app.post('/api/feedback', (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to submit feedback`);

//   // Destructuring assignment for the items in req.body
//   const { email, feedbackType, feedback } = req.body;

//   // If all the required properties are present
//   if (email && feedbackType && feedback) {
//     // Variable for the object we will save
//     const newFeedback = {
//       email,
//       feedbackType,
//       feedback,
//       feedback_id: uuid(),
//     };

//     readAndAppend(newFeedback, './db/feedback.json');

//     const response = {
//       status: 'success',
//       body: newFeedback,
//     };

//     res.json(response);
//   } else {
//     res.json('Error in posting feedback');
//   }
// });

app.delete('/api/notes/:id', (req, res) => {
	console.info(`${req.method} request received for notes id`, JSON.parse(req));
});

// GET Route for homepage
app.get('*', (req, res) => {
	console.log('in wildcard');
	console.info(`${req.method} request received for wildcard`, `${req}`);
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => console.log(`Notes App listening at http://localhost:${PORT} 🚀`));
