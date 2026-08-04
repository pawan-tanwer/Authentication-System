const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer)=>{
    return new Promise((resolve,reject)=>{
        const uploadSchema = cloudinary.uploader.upload_stream(
            {
                folder:"avatars"
            },
            (error,result)=>{
                if(error){
                    return reject(error);
                }
                resolve(result);
            }
        )
        streamifier
        .createReadStream(buffer)
        .pipe(uploadSchema);
    })

}

module.exports=uploadToCloudinary;