const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error); 
            reject(new Error("Cloudinary upload failed: " + JSON.stringify(error)));
          } else {
            resolve(result);
          }
        }
      );
      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);  
    throw error;
  }
};



module.exports = { uploadToCloudinary };
