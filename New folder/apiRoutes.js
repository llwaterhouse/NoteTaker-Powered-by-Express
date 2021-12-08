const router = require("express").Router();
const fs = require("fs")
const db = require("../db/db.json");

router.get("/api/notes", (req, res) => {
    return res.json(db)
})

router.post("/api/notes", (req, res) => {
    console.log(req.body)
    // create new object with id to push
    db.push(req.body)
    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
        if (err) throw err;
    })
    return res.json(db)
})


// tips.delete('/:tip_id', (req, res) => {
//     const tipId = req.params.tip_id;
//     readFromFile('./db.json')
//       .then((data) => JSON.parse(data))
//       .then((json) => {
//         // Make a new array of all tips except the one with the ID provided in the URL
//         const result = json.filter((tip) => tip.tip_id !== tipId);
  
//         // Save that array to the filesystem
//         writeToFile('./db/tips.json', result);
  
//         // Respond to the DELETE request
//         res.json(`Item ${tipId} has been deleted 🗑️`);
//       });
//   });

module.exports = router