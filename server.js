const express = require("express");
const nodemon = require("nodemon");
const app = express(); 
require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 5050;

app.get("/", (req, res)=>{
    return res.status(200).json({"message":"Connected"})
})

app.listen(PORT, ()=>{
    console.log(`Server is on!!! ${PORT}`)
})
