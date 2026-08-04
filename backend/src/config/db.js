const mongoose = require("mongoose");

const connectDb = async()=>{
   await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log("MongoDb is connected")})
    .catch((e)=>console.log("error :",e))
}

module.exports = connectDb;