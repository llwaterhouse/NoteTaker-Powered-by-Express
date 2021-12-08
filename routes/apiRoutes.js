const router = require("express").Router();
// const fs = require("fs");
const db = require("../db/db.json");
const {readFromFile, writeToFile, readAndAppend } = require ("../helpers/fsUtils");

// Helper method for generating unique ids
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
// router.get('/notes', (req, res) => {
router.get("api/notes", (req, res) => {
	console.info(`${req.method} request received for notes`);
	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

module.exports = router