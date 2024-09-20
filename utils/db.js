const mongoose =require("mongoose");
const URI = process.env.MONGODB_URI;
// mongoose.connect(URI)


const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to DB");
        
    } catch (error) {
        console.log("Not connected to db");
        console.log(error);
        process.exit(0);
    }
}

module.exports =connectDB;
