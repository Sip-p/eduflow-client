 
// import React, { useState } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import axios from "axios";

// const CourseCreation = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [thumbnailUrl, setThumbnailUrl] = useState(""); // Cloudinary URL
//   const [loading, setLoading] = useState(false);
//   const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

//   const [lessons, setLessons] = useState([]);
//   const [currLessonTitle, setCurrLessonTitle] = useState("");
//   const [currLessonContent, setCurrLessonContent] = useState("");
//   const [currLessonVideoFile, setCurrLessonVideoFile] = useState(null);
//   const [currVideoPreview, setCurrVideoPreview] = useState(null);
//   const [uploadingVideo, setUploadingVideo] = useState(false);

// const backendUrl=import.meta.env.VITE_BACKEND_URL


// const handleThumbnailUpload = async (file) => {
//   if (!file) return "";

//   setUploadingThumbnail(true);
//   try {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axios.post(`${backendUrl}/api/upload/upload-image`, formData, {
//       headers: { "Content-Type": "multipart/form-data" }
//     });

//     if (response.data?.url) {
//       setThumbnailUrl(response.data.url);
//       return response.data.url;
//     }

//     throw new Error("Upload failed: No URL returned");
//   } catch (error) {
//     console.error("Thumbnail upload error:", error.response?.data || error.message);
//     alert("Thumbnail upload failed: " + (error.response?.data?.message || error.message));
//     return "";
//   } finally {
//     setUploadingThumbnail(false);
//   }
// };



//   // Upload video to Cloudinary
//   const handleVideoUpload = async (file) => {
//     if (!file) return "";
    
//     setUploadingVideo(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       const response = await axios.post(`${backendUrl}/api/upload/upload-video`, formData, {
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           console.log(`Upload progress: ${progress}%`);
//         }
//       });
      
//       if (response.data && response.data.url) {
//         return {
//           videoUrl: response.data.url,
//           duration: response.data.duration || 0,
//           thumbnail: response.data.thumbnail || ""
//         };
//       }
//       throw new Error('Video upload failed');
//     } catch (error) {
//       console.error('Video upload error:', error);
//       alert('Video upload failed: ' + (error.response?.data?.message || error.message));
//       return null;
//     } finally {
//       setUploadingVideo(false);
//     }
//   };

//   // Handle thumbnail selection
//   const handleThumbnailChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }
    
//     setThumbnailFile(file);
//     setThumbnailPreview(URL.createObjectURL(file));
    
//     // Auto-upload thumbnail
//     await handleThumbnailUpload(file);
//   };

//   // Handle video selection
//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (!file.type.startsWith('video/')) {
//       alert('Please select a video file');
//       return;
//     }
    
//     if (file.size > 100 * 1024 * 1024) { // 100MB limit
//       alert('Video file must be less than 100MB');
//       return;
//     }
    
//     setCurrLessonVideoFile(file);
//     setCurrVideoPreview(URL.createObjectURL(file));
//   };

//   // Add lesson with video upload
//   // const addLesson = async () => {
//   //   if (!currLessonTitle || !currLessonContent) {
//   //     alert('Please fill in lesson title and content');
//   //     return;
//   //   }
    
//   //   if (!currLessonVideoFile) {
//   //     alert('Please select a video for this lesson');
//   //     return;
//   //   }

//   //   // Upload video first
//   //   const videoData = await handleVideoUpload(currLessonVideoFile);
//   //   if (!videoData) return; // Upload failed
    
//   //   const newLesson = {
//   //     title: currLessonTitle,
//   //     description: currLessonContent,
//   //     videoUrl: videoData.videoUrl,
//   //     duration: videoData.duration,
//   //     thumbnail: videoData.thumbnail
//   //   };

//   //   setLessons([...lessons, newLesson]);
    
//   //   // Reset lesson form
//   //   setCurrLessonTitle("");
//   //   setCurrLessonContent("");
//   //   setCurrLessonVideoFile(null);
//   //   setCurrVideoPreview(null);
//   // };

//   const addLesson = async () => {
//   if (!currLessonTitle || !currLessonContent) {
//     alert("Please fill in lesson title and content");
//     return;
//   }

//   if (!currLessonVideoFile) {
//     alert("Please select a video for this lesson");
//     return;
//   }

//   // 💡 Save values before upload (avoid re-render state loss)
//   const tempTitle = currLessonTitle;
//   const tempContent = currLessonContent;
//   const tempFile = currLessonVideoFile;

//   const videoData = await handleVideoUpload(tempFile);
//   if (!videoData) return;

//   const newLesson = {
//     title: tempTitle,
//     description: tempContent,
//     videoUrl: videoData.videoUrl,
//     duration: videoData.duration,
//     thumbnail: videoData.thumbnail,
//   };

//   // Add new lesson safely
//   setLessons((prev) => [...prev, newLesson]);

//   // Reset lesson form
//   setCurrLessonTitle("");
//   setCurrLessonContent("");
//   setCurrLessonVideoFile(null);
//   setCurrVideoPreview(null);
// };


//   // Create course
//   const handleCreateCourse = async () => {
//     if (!title || !description || !price || !category) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     if (lessons.length === 0) {
//       alert('Please add at least one lesson');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       // Create course with JSON data (not FormData)
//       const courseData = {
//         title: title.trim(),
//         description: description.trim(),
//         price: parseFloat(price),
//         category: category.trim(),
//         thumbnail: thumbnailUrl,
//         lessons: lessons,
//         published: false
//       };

//       console.log('Creating course with data:', courseData);

//       const response = await axios.post(`${backendUrl}/api/course/create`, courseData, {
//         headers: {
//           'Content-Type': 'application/json',
//           // Add authorization header if you have authentication
//            'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       console.log('Course created successfully:', response.data);
//       alert('Course created successfully!');
      
//       // Reset form
//       setTitle("");
//       setDescription("");
//       setPrice("");
//       setCategory("");
//       setThumbnailFile(null);
//       setThumbnailPreview(null);
//       setThumbnailUrl("");
//       setLessons([]);
      
//     } catch (error) {
//       console.error('Course creation error:', error);
//       alert('Course creation failed: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove lesson
//   const removeLesson = (index) => {
//     const updatedLessons = lessons.filter((_, i) => i !== index);
//     setLessons(updatedLessons);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold text-center">Create a New Course</h1>

//       {/* Course Title */}
//       <div>
//         <label className="block font-semibold mb-2">Course Title *</label>
//         <input
//           type="text"
//           placeholder="Enter course title"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>

//       {/* Course Description */}
//       <div>
//         <label className="block font-semibold mb-2">Description *</label>
//         <ReactQuill
//           theme="snow"
//           value={description}
//           onChange={setDescription}
//           className="bg-white rounded-lg"
//           placeholder="Describe your course..."
//         />
//       </div>

//       {/* Price and Category */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-semibold mb-2">Price ($) *</label>
//           <input
//             type="number"
//             placeholder="0.00"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             min="0"
//             step="0.01"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-semibold mb-2">Category *</label>
//           <input
//             type="text"
//             placeholder="e.g. Web Development"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           />
//         </div>
//       </div>

//       {/* Course Thumbnail */}
//       <div>
//         <label className="block font-semibold mb-2">Course Thumbnail</label>
//         <input 
//           type="file" 
//           accept="image/*" 
//           onChange={handleThumbnailChange}
//           className="w-full p-3 border border-gray-300 rounded-lg"
//           disabled={uploadingThumbnail}
//         />
//         {uploadingThumbnail && (
//           <p className="text-blue-500 mt-2">Uploading thumbnail...</p>
//         )}
//         {thumbnailPreview && (
//           <img
//             src={thumbnailPreview}
//             alt="Course Thumbnail"
//             className="mt-3 w-48 h-32 object-cover rounded-lg border"
//           />
//         )}
//         {thumbnailUrl && (
//           <p className="text-green-500 mt-2">✓ Thumbnail uploaded successfully</p>
//         )}
//       </div>

//       {/* Lessons Section */}
//       <div className="border-t pt-6">
//         <h2 className="text-2xl font-semibold mb-4">Course Lessons</h2>

//         {/* Add Lesson Form */}
//         <div className="bg-gray-50 p-6 rounded-lg mb-6">
//           <h3 className="text-lg font-semibold mb-4">Add New Lesson</h3>
          
//           <input
//             type="text"
//             placeholder="Lesson Title"
//             className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//             value={currLessonTitle}
//             onChange={(e) => setCurrLessonTitle(e.target.value)}
//           />

//           <ReactQuill
//             theme="snow"
//             value={currLessonContent}
//             onChange={setCurrLessonContent}
//             className="mb-4 bg-white rounded-lg"
//             placeholder="Lesson description or content..."
//           />

//           <input 
//             type="file" 
//             accept="video/*" 
//             onChange={handleVideoChange}
//             className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//             disabled={uploadingVideo}
//           />
          
//           {uploadingVideo && (
//             <p className="text-blue-500 mb-4">Uploading video... This may take a while for large files.</p>
//           )}
          
//           {currVideoPreview && (
//             <video
//               src={currVideoPreview}
//               controls
//               className="w-full max-w-md h-48 rounded-lg border mb-4"
//             />
//           )}

//           <button
//             onClick={addLesson}
//             disabled={uploadingVideo || !currLessonTitle || !currLessonContent || !currLessonVideoFile}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {uploadingVideo ? "Uploading..." : "Add Lesson"}
//           </button>
//         </div>

//         {/* Lessons List */}
//         {lessons.length > 0 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Course Lessons ({lessons.length})</h3>
//             <div className="space-y-4">
//               {lessons.map((lesson, index) => (
//                 <div key={index} className="bg-white p-4 border rounded-lg">
//                   <div className="flex justify-between items-start mb-2">
//                     <h4 className="font-semibold text-lg">{index + 1}. {lesson.title}</h4>
//                     <button
//                       onClick={() => removeLesson(index)}
//                       className="text-red-500 hover:text-red-700 font-semibold"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                   <div className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: lesson.description }} />
//                   {lesson.duration > 0 && (
//                     <p className="text-sm text-gray-500">Duration: {Math.round(lesson.duration / 60)} minutes</p>
//                   )}
//                   <p className="text-sm text-green-500">✓ Video uploaded</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Create Course Button */}
//       <div className="text-center pt-6">
//         <button
//           onClick={handleCreateCourse}
//           disabled={loading || uploadingThumbnail || uploadingVideo || lessons.length === 0}
//           className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {loading ? "Creating Course..." : "Create Course"}
//         </button>
//       </div>
      
//       {/* Progress Indicator */}
//       {(loading || uploadingThumbnail || uploadingVideo) && (
//         <div className="fixed top-0 left-0 w-full bg-blue-500 text-white text-center py-2">
//           {uploadingThumbnail && "Uploading thumbnail..."}
//           {uploadingVideo && "Uploading video..."}
//           {loading && "Creating course..."}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseCreation;

 
import React, { useState, useRef } from "react";
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
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [lessons, setLessons] = useState([]);
  const [currLessonTitle, setCurrLessonTitle] = useState("");
  const [currLessonContent, setCurrLessonContent] = useState("");
  const [currLessonVideoFile, setCurrLessonVideoFile] = useState(null);
  const [currVideoPreview, setCurrVideoPreview] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Use refs to preserve values during async operations
  const lessonTitleRef = useRef("");
  const lessonContentRef = useRef("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Upload thumbnail to backend
  const handleThumbnailUpload = async (file) => {
    if (!file) return "";

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${backendUrl}/api/upload/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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

  // Upload video to backend
  const handleVideoUpload = async (file) => {
    if (!file) return null;

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${backendUrl}/api/upload/upload-video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${progress}%`);
          },
        }
      );

      if (response.data?.url) {
        return {
          videoUrl: response.data.url,
          duration: response.data.duration || 0,
          thumbnail: response.data.thumbnail || "",
        };
      }

      throw new Error("Video upload failed: No URL returned");
    } catch (error) {
      console.error("Video upload error:", error.response?.data || error.message);
      alert("Video upload failed: " + (error.response?.data?.message || error.message));
      return null;
    } finally {
      setUploadingVideo(false);
    }
  };

  // Handle thumbnail selection and auto-upload
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));

    // Auto-upload thumbnail
    await handleThumbnailUpload(file);
  };

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video file must be less than 100MB");
      return;
    }

    setCurrLessonVideoFile(file);
    setCurrVideoPreview(URL.createObjectURL(file));
  };

  // Update refs when inputs change
  const handleLessonTitleChange = (value) => {
    setCurrLessonTitle(value);
    lessonTitleRef.current = value;
  };

  const handleLessonContentChange = (value) => {
    setCurrLessonContent(value);
    lessonContentRef.current = value;
  };

  // Add lesson with video upload
  const addLesson = async () => {
    // Use refs to get current values
    const titleToUse = lessonTitleRef.current.trim();
    const contentToUse = lessonContentRef.current.trim();

    if (!titleToUse || !contentToUse) {
      alert("Please fill in lesson title and content");
      return;
    }

    if (!currLessonVideoFile) {
      alert("Please select a video for this lesson");
      return;
    }

    console.log("Adding lesson with title:", titleToUse);
    console.log("Content length:", contentToUse.length);

    // Upload video
    const videoData = await handleVideoUpload(currLessonVideoFile);
    if (!videoData) {
      console.error("Video upload failed");
      return;
    }

    console.log("Video uploaded successfully:", videoData);

    const newLesson = {
      title: titleToUse,
      description: contentToUse,
      videoUrl: videoData.videoUrl,
      duration: videoData.duration,
      thumbnail: videoData.thumbnail,
    };

    console.log("Creating new lesson:", newLesson);

    // Add lesson to list
    setLessons((prev) => {
      const updated = [...prev, newLesson];
      console.log("Updated lessons array:", updated);
      return updated;
    });

    // Reset lesson form and refs
    setCurrLessonTitle("");
    setCurrLessonContent("");
    lessonTitleRef.current = "";
    lessonContentRef.current = "";
    setCurrLessonVideoFile(null);
    setCurrVideoPreview(null);

    alert("Lesson added successfully!");
  };

  // Create course
  const handleCreateCourse = async () => {
    // Validation
    if (!title.trim() || !description.trim() || !price || !category.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (lessons.length === 0) {
      alert("Please add at least one lesson");
      return;
    }

    if (!thumbnailUrl) {
      alert("Please upload a course thumbnail");
      return;
    }

    console.log("Creating course with lessons:", lessons);

    setLoading(true);
    try {
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        thumbnail: thumbnailUrl,
        lessons: lessons,
        published: false,
      };

      console.log("Course data being sent:", JSON.stringify(courseData, null, 2));

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create a course");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/course/create`,
        courseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Course created successfully:", response.data);
      alert("Course created successfully!");

      // Reset entire form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setThumbnailUrl("");
      setLessons([]);
      setCurrLessonTitle("");
      setCurrLessonContent("");
      lessonTitleRef.current = "";
      lessonContentRef.current = "";
      setCurrLessonVideoFile(null);
      setCurrVideoPreview(null);
    } catch (error) {
      console.error("Course creation error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(
        "Course creation failed: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Remove lesson from list
  const removeLesson = (index) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
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
        <label className="block font-semibold mb-2">Course Thumbnail *</label>
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
            onChange={(e) => handleLessonTitleChange(e.target.value)}
            disabled={uploadingVideo}
          />

          <ReactQuill
            theme="snow"
            value={currLessonContent}
            onChange={handleLessonContentChange}
            className="mb-4 bg-white rounded-lg"
            placeholder="Lesson description or content..."
            readOnly={uploadingVideo}
          />

          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            disabled={uploadingVideo}
          />

          {uploadingVideo && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">Uploading video...</p>
              <p className="text-sm">This may take a while for large files. Please don't close this page.</p>
            </div>
          )}

          {currVideoPreview && !uploadingVideo && (
            <video
              src={currVideoPreview}
              controls
              className="w-full max-w-md h-48 rounded-lg border mb-4"
            />
          )}

          <button
            onClick={addLesson}
            disabled={
              uploadingVideo ||
              !currLessonTitle.trim() ||
              !currLessonContent.trim() ||
              !currLessonVideoFile
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadingVideo ? "Uploading Video..." : "Add Lesson"}
          </button>
        </div>

        {/* Lessons List */}
        {lessons.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Course Lessons ({lessons.length})
            </h3>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={index} className="bg-white p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">
                      {index + 1}. {lesson.title}
                    </h4>
                    <button
                      onClick={() => removeLesson(index)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                      disabled={uploadingVideo || loading}
                    >
                      Remove
                    </button>
                  </div>
                  <div
                    className="text-gray-600 mb-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.description }}
                  />
                  {lesson.duration > 0 && (
                    <p className="text-sm text-gray-500">
                      Duration: {Math.round(lesson.duration / 60)} minutes
                    </p>
                  )}
                  <p className="text-sm text-green-500">✓ Video: {lesson.videoUrl.substring(0, 50)}...</p>
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
          disabled={
            loading ||
            uploadingThumbnail ||
            uploadingVideo ||
            lessons.length === 0 ||
            !thumbnailUrl
          }
          className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Course..." : `Create Course (${lessons.length} lessons)`}
        </button>
        {lessons.length === 0 && (
          <p className="text-red-500 text-sm mt-2">Please add at least one lesson</p>
        )}
      </div>

      {/* Progress Indicator */}
      {(loading || uploadingThumbnail || uploadingVideo) && (
        <div className="fixed top-0 left-0 w-full bg-blue-500 text-white text-center py-2 z-50">
          {uploadingThumbnail && "Uploading thumbnail..."}
          {uploadingVideo && "Uploading video... Please wait, don't close this page"}
          {loading && "Creating course..."}
        </div>
      )}
    </div>
  );
};

export default CourseCreation;