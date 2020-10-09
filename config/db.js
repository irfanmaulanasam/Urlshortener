const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
    try{
        await mongoose.connect(db, {
         useNewUrlParser: true, 
         useCreateIndex: true,
         useUnifiedTopology: true
        });
        console.log("Connected to DB");
        console.log(db);
    }catch(err){
        console.error(err.message);
    }
}

module.exports = connectDB;