const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes")
const bodyParser = require ('body-parser')
const cors = require('cors')

const app = express();
app.use(cors())
connectDB();

app.use(express.json({}));
app.use(express.urlencoded({ extended: false }))
app.use("/",routes)
app.use(bodyParser.urlencoded({ extended: true })); 

const PORT = 8000;
app.listen(PORT, () => console.log("Server is listening on port " + PORT));


