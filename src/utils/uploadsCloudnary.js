import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});

const uploadOnCloudnary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(
            localFilePath, {
            resource_type: "auto"
        }
        )
        console.log("File uploaded on cloudinary!, \n File src: \n ", response.url);
        // After uploading the file to cloud, we should delete it locally!
       await  fs.unlink(localFilePath);
       return response;
    } catch (error) {
        await fs.unlink(localFilePath);
        return null;
    }
}