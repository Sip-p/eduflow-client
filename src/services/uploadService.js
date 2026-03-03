import api from "./api";

export const uploadService = {
  uploadVideo: async (file, onProgress) => {
    const form = new FormData();
    form.append("video", file);
    const res = await api.post("/upload/video", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress) {
          const pct = Math.round((e.loaded * 100) / e.total);
          onProgress(pct);
        }
      },
    });
    return res.data.url;
  },

  uploadImage: async (file) => {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post("/upload/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  },

  uploadAssignment: async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/upload/upload-assignment", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.url) throw new Error("Upload failed");
    return res.data.url;
  },
};