import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

//cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded on cloudinary! , File src: " + response.url);
    fs.unlinkSync(localFilePath); //deleting file from the server after uploading to the cloudinary
    return response;
  } catch (error) {
    console.log("Error on Cloudinary ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicID) => {
  try {
    const result = await cloudinary.uploader.destroy(publicID);
    console.log("Deleted from cloudinary , Public ID : ", publicID);
  } catch (error) {
    console.log("Error deleting from cloudinary!");
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
