const router = require("express").Router();
// const express = require("express");
const fs = require("fs");
const db = require("../db/db.json");
const {readFromFile, writeToFile, readAndAppend } = require ("../helpers/fsUtils");

// Helper method for generating unique ids
const uuid = require('../helpers/uuid');

// const app = express();

// GET Route for retrieving all the notes
router.get('/notes', (req, res) => {
// app.get("/notes", (req, res) => {
	console.info(`${req.method} request received for notes`);
	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

router.post('/notes', (req, res) => {
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
router.delete('/notes/:id', (req, res) => {
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

// 
module.exports = router
// module.exports = app