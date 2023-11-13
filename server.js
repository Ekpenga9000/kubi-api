const express = require("express");
const app = express(); 
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/authRoute");
app.use(express.json());
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.static("public"));

app.use("/", authRouter);

app.get("/", (req, res)=>{
    return res.status(200).json({"message":"Connected"})
});

app.listen(PORT, ()=>{
    console.log(`Server is on!!! ${PORT}`);
})
