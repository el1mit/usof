require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const mysql = require('mysql2');

app.use(express.json());
app.use(cors());

// Redirect requests to endpoint starting with /posts to postRoutes.js
app.use("/posts", require("./routes/postRoutes"));

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    res.status(500).json({
        message: "Something went really wrong",
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
});