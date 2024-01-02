"use strict";
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('client'));
app.get("/", (req, res) => {
    res.render("./client/index.html");
});

app.listen(port, () => {
    console.log(`Client Server is running at http://localhost:${port}`)
});