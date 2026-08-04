const cloudinary = require("../config/cloudinary.js");

const  deleteFromCloudinary = async(publicId)=>{
    if(!publicId) return;
    
    await cloudinary.uploader.destroy(publicId);

}

module.exports = deleteFromCloudinary;