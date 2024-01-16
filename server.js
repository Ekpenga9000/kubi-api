const express = require("express");
const app = express(); 
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const projectRouter = require("./routes/projectRoute");
const issueRouter = require("./routes/issueRoute");
const sprintRouter = require("./routes/sprintRoute");
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/projects", projectRouter);
app.use("/issues", issueRouter);
app.use("/sprint", sprintRouter);

app.get("/", (req, res)=>{
    return res.status(200).json({"message":"Connected"})
});

app.listen(PORT, ()=>{
    console.log(`Server is on!!! ${PORT}`);
})
