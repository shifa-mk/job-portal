import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadOnCloudinary = async (fileUri) => {
  try {
    if (!fileUri) return null;

    // Upload the file on cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default cloudinary;
