import axios from "axios";

export const uploadVideoToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "video_upload_preset");

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/video/upload`,
        formData
    );

    return res.data.secure_url;
};