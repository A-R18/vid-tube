import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

const uploadOnCloudnary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDNARY_NAME,
      api_key: process.env.CLOUDNARY_API_KEY,
      api_secret: process.env.CLOUDNARY_API_SECRET,
    });

    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // After uploading the file to cloud, we should delete it locally!
    await fs.unlink(localFilePath);

    return response;
  } catch (error) {
    // await fs.unlink(localFilePath);

    return null;
  }
};

const deleteFromCloudnary = async (publicID, resourceType) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDNARY_NAME,
      api_key: process.env.CLOUDNARY_API_KEY,
      api_secret: process.env.CLOUDNARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(publicID, {
      resource_type: resourceType, invalidate:true
    });
    console.log("Deleted from cloudinary, via public id ");
  } catch (error) {
    console.log("Error deleteing from cloudnary \n", error);
    return null;
  }
};

export { uploadOnCloudnary, deleteFromCloudnary };
