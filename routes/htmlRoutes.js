const router = require("express").Router();
// 

const path = require("path");

router.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, '../public/notes.html'));
});

//This function *MUST* be last of ALL the .gets, even looking at other route files!!!!
// router.get("*",  (req, res) => {
// 		res.sendFile(path.join(__dirname, '../public/index.html'));
// });

module.exports = router