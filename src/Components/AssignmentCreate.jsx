import React, { useState } from "react";
import axios from "axios";

const AssignmentCreate = () => {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalPoints, setTotalPoints] = useState(100);
  const [attachments, setAttachments] = useState(null);
  const [course, setCourse] = useState("");
  const [assignmentNumber, setAssignmentNumber] = useState("");
  const [attachmentsPreview, setAttachmentsPreview] = useState(null);
  const [attachmentsUrl, setAttachmentsUrl] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // 📂 Handle file selection
  const handleAssignmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachments(file);
    setAttachmentsPreview(URL.createObjectURL(file));
  };

  // ☁️ Upload file to Cloudinary via backend
  const handleAssignmentUpload = async () => {
    if (!attachments) {
      alert("Please select a file to upload");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", attachments);

      console.log("Uploading file:", attachments.name);

      const res = await axios.post(
        `${backendUrl}/api/upload/upload-assignment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.url) {
        console.log("✅ File uploaded successfully:", res.data.url);
        setAttachmentsUrl(res.data.url);
        return res.data.url;
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("File upload failed");
      return null;
    }
  };

  // 🧾 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Upload the file first
      const uploadedUrl = await handleAssignmentUpload();

      // Step 2: Create assignment object (not FormData)
      const payload = {
        description,
        course,
        dueDate,
        totalPoints,
        assignmentNumber,
        attachments: uploadedUrl || "",
      };

      console.log("Submitting assignment payload:", payload);

      // Step 3: Send JSON to backend
      const res = await axios.post(
        `${backendUrl}/api/assignments/createassignment`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Assignment created:", res.data);
      alert("✅ Assignment Created Successfully!");

      // Reset form
      setDescription("");
      setDueDate("");
      setTotalPoints(100);
      setAttachments(null);
      setCourse("");
      setAssignmentNumber("");
      setAttachmentsPreview(null);
      setAttachmentsUrl("");

    } catch (error) {
      console.error("❌ Error creating assignment:", error);
      alert("❌ Failed to create assignment");
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white shadow-md p-5 rounded-2xl w-[400px]"
      >
        <label className="flex flex-col text-gray-700">
          Course ID / Name
          <input
            type="text"
            className="border p-2 rounded-md"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Description
          <input
            type="text"
            className="border p-2 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Assignment Number
          <input
            type="text"
            className="border p-2 rounded-md"
            value={assignmentNumber}
            onChange={(e) => setAssignmentNumber(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Total Points
          <input
            type="number"
            className="border p-2 rounded-md"
            value={totalPoints}
            onChange={(e) => setTotalPoints(e.target.value)}
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Due Date
          <input
            type="date"
            className="border p-2 rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col text-gray-700">
          Upload Attachment
          <input
            type="file"
            className="border p-2 rounded-md"
            onChange={handleAssignmentChange}
          />
          {attachmentsPreview && (
            <a
              href={attachmentsPreview}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm mt-1"
            >
              Preview Selected File
            </a>
          )}
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentCreate;
