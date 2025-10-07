 
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const CourseCreation = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Cloudinary URL
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [lessons, setLessons] = useState([]);
  const [currLessonTitle, setCurrLessonTitle] = useState("");
  const [currLessonContent, setCurrLessonContent] = useState("");
  const [currLessonVideoFile, setCurrLessonVideoFile] = useState(null);
  const [currVideoPreview, setCurrVideoPreview] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

const backendUrl=import.meta.env.VITE_BACKEND_URL


const handleThumbnailUpload = async (file) => {
  if (!file) return "";

  setUploadingThumbnail(true);
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${backendUrl}/api/upload/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if (response.data?.url) {
      setThumbnailUrl(response.data.url);
      return response.data.url;
    }

    throw new Error("Upload failed: No URL returned");
  } catch (error) {
    console.error("Thumbnail upload error:", error.response?.data || error.message);
    alert("Thumbnail upload failed: " + (error.response?.data?.message || error.message));
    return "";
  } finally {
    setUploadingThumbnail(false);
  }
};



  // Upload video to Cloudinary
  const handleVideoUpload = async (file) => {
    if (!file) return "";
    
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${backendUrl}/api/upload/upload-video`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${progress}%`);
        }
      });
      
      if (response.data && response.data.url) {
        return {
          videoUrl: response.data.url,
          duration: response.data.duration || 0,
          thumbnail: response.data.thumbnail || ""
        };
      }
      throw new Error('Video upload failed');
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Video upload failed: ' + (error.response?.data?.message || error.message));
      return null;
    } finally {
      setUploadingVideo(false);
    }
  };

  // Handle thumbnail selection
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    
    // Auto-upload thumbnail
    await handleThumbnailUpload(file);
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      alert('Video file must be less than 100MB');
      return;
    }
    
    setCurrLessonVideoFile(file);
    setCurrVideoPreview(URL.createObjectURL(file));
  };

  // Add lesson with video upload
  const addLesson = async () => {
    if (!currLessonTitle || !currLessonContent) {
      alert('Please fill in lesson title and content');
      return;
    }
    
    if (!currLessonVideoFile) {
      alert('Please select a video for this lesson');
      return;
    }

    // Upload video first
    const videoData = await handleVideoUpload(currLessonVideoFile);
    if (!videoData) return; // Upload failed
    
    const newLesson = {
      title: currLessonTitle,
      description: currLessonContent,
      videoUrl: videoData.videoUrl,
      duration: videoData.duration,
      thumbnail: videoData.thumbnail
    };

    setLessons([...lessons, newLesson]);
    
    // Reset lesson form
    setCurrLessonTitle("");
    setCurrLessonContent("");
    setCurrLessonVideoFile(null);
    setCurrVideoPreview(null);
  };

  // Create course
  const handleCreateCourse = async () => {
    if (!title || !description || !price || !category) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (lessons.length === 0) {
      alert('Please add at least one lesson');
      return;
    }
    
    setLoading(true);
    try {
      // Create course with JSON data (not FormData)
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        thumbnail: thumbnailUrl,
        lessons: lessons,
        published: false
      };

      console.log('Creating course with data:', courseData);

      const response = await axios.post(`${backendUrl}/api/course/create`, courseData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication
           'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Course created successfully:', response.data);
      alert('Course created successfully!');
      
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setThumbnailUrl("");
      setLessons([]);
      
    } catch (error) {
      console.error('Course creation error:', error);
      alert('Course creation failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Remove lesson
  const removeLesson = (index) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    setLessons(updatedLessons);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Create a New Course</h1>

      {/* Course Title */}
      <div>
        <label className="block font-semibold mb-2">Course Title *</label>
        <input
          type="text"
          placeholder="Enter course title"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Course Description */}
      <div>
        <label className="block font-semibold mb-2">Description *</label>
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          className="bg-white rounded-lg"
          placeholder="Describe your course..."
        />
      </div>

      {/* Price and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Price ($) *</label>
          <input
            type="number"
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Category *</label>
          <input
            type="text"
            placeholder="e.g. Web Development"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Course Thumbnail */}
      <div>
        <label className="block font-semibold mb-2">Course Thumbnail</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleThumbnailChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          disabled={uploadingThumbnail}
        />
        {uploadingThumbnail && (
          <p className="text-blue-500 mt-2">Uploading thumbnail...</p>
        )}
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Course Thumbnail"
            className="mt-3 w-48 h-32 object-cover rounded-lg border"
          />
        )}
        {thumbnailUrl && (
          <p className="text-green-500 mt-2">✓ Thumbnail uploaded successfully</p>
        )}
      </div>

      {/* Lessons Section */}
      <div className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Course Lessons</h2>

        {/* Add Lesson Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Lesson</h3>
          
          <input
            type="text"
            placeholder="Lesson Title"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            value={currLessonTitle}
            onChange={(e) => setCurrLessonTitle(e.target.value)}
          />

          <ReactQuill
            theme="snow"
            value={currLessonContent}
            onChange={setCurrLessonContent}
            className="mb-4 bg-white rounded-lg"
            placeholder="Lesson description or content..."
          />

          <input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            disabled={uploadingVideo}
          />
          
          {uploadingVideo && (
            <p className="text-blue-500 mb-4">Uploading video... This may take a while for large files.</p>
          )}
          
          {currVideoPreview && (
            <video
              src={currVideoPreview}
              controls
              className="w-full max-w-md h-48 rounded-lg border mb-4"
            />
          )}

          <button
            onClick={addLesson}
            disabled={uploadingVideo || !currLessonTitle || !currLessonContent || !currLessonVideoFile}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadingVideo ? "Uploading..." : "Add Lesson"}
          </button>
        </div>

        {/* Lessons List */}
        {lessons.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Course Lessons ({lessons.length})</h3>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={index} className="bg-white p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{index + 1}. {lesson.title}</h4>
                    <button
                      onClick={() => removeLesson(index)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: lesson.description }} />
                  {lesson.duration > 0 && (
                    <p className="text-sm text-gray-500">Duration: {Math.round(lesson.duration / 60)} minutes</p>
                  )}
                  <p className="text-sm text-green-500">✓ Video uploaded</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Course Button */}
      <div className="text-center pt-6">
        <button
          onClick={handleCreateCourse}
          disabled={loading || uploadingThumbnail || uploadingVideo || lessons.length === 0}
          className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Course..." : "Create Course"}
        </button>
      </div>
      
      {/* Progress Indicator */}
      {(loading || uploadingThumbnail || uploadingVideo) && (
        <div className="fixed top-0 left-0 w-full bg-blue-500 text-white text-center py-2">
          {uploadingThumbnail && "Uploading thumbnail..."}
          {uploadingVideo && "Uploading video..."}
          {loading && "Creating course..."}
        </div>
      )}
    </div>
  );
};

export default CourseCreation;

 