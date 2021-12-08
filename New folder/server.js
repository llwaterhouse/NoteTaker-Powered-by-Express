const express = require('express');

// initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3001;

//settings of our server
app.use(express.json())
app.use(express.static("public"))

//defining routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.use(apiRoutes)
app.use(htmlRoutes)

app.listen(PORT, () => {
    console.log('working')
})