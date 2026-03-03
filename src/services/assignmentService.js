import api from "./api";

export const assignmentService = {
  getByCourse: (courseId) =>
    api.get(`/assignments/courseassignments/${courseId}`).then((r) => r.data),

  create: (payload) =>
    api.post("/assignments/createassignment", payload).then((r) => r.data),

  uploadFile: async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/upload/upload-assignment", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.url) throw new Error("Upload failed: no URL returned");
    return res.data.url;
  },

  openAssignment: (publicId) =>
    api.get(`/assignments/open/${publicId}`).then((r) => r.data),
};