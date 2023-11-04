const express = require("express");
const nodemon = require("nodemon");
const app = express(); 

app.get("/", (req, res)=>{
    return res.status(200).json({"message":"Connected"})
})

app.listen(5050, ()=>{
    console.log("Server is on!!! 5050")
})
