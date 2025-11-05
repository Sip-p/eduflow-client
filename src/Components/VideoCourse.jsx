// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import GroupChat from "./GroupChat";

// // const VideoCourse = () => {
// //   const courseId = window.location.pathname.split("/")[2];
// //   const backendUrl = import.meta.env.VITE_BACKEND_URL;

// //   const [videos, setVideos] = useState([]);
// //   const [thumbnail, setThumbnail] = useState("");
// //   const [currentVideo, setCurrentVideo] = useState(null);
// //   const [assignments, setAssignments] = useState([]);

// //   const getVideo = async () => {
// //     try {
// //       const response = await axios.get(`${backendUrl}/api/course/${courseId}`);

// //       if (response.status === 200) {
// //         setThumbnail(response.data.thumbnail || "");
// //         const lessons = response.data.lessons || [];
// //         setVideos(lessons);

// //         if (lessons.length > 0) {
// //           setCurrentVideo(lessons[0]);
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Error fetching course:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     getVideo();
// //   }, []);

// //   const getYouTubeEmbedUrl = (url) => {
// //     try {
// //       const urlObj = new URL(url);
// //       if (urlObj.hostname.includes("youtube.com")) {
// //         const videoId = urlObj.searchParams.get("v");
// //         return `https://www.youtube.com/embed/${videoId}`;
// //       } else if (urlObj.hostname.includes("youtu.be")) {
// //         const videoId = urlObj.pathname.slice(1);
// //         return `https://www.youtube.com/embed/${videoId}`;
// //       }
// //       return null;
// //     } catch {
// //       return null;
// //     }
// //   };

// //   const renderVideo = (video) => {
// //     const ytUrl = getYouTubeEmbedUrl(video.videoUrl);
// //     if (ytUrl) {
// //       return (
// //         <iframe
// //           width="100%"
// //           height="500"
// //           src={ytUrl}
// //           title={video.title}
// //           frameBorder="0"
// //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //           allowFullScreen
// //           className="rounded-lg shadow-lg"
// //         ></iframe>
// //       );
// //     }

// //     return (
// //       <video
// //         src={video.videoUrl}
// //         controls
// //         autoPlay
// //         className="w-full rounded-lg shadow-lg h-64 "
// //       />
// //     );
// //   };

// //   const getAssignments=async()=>{
// // try {
// //   console.log("Fetching assignments for courseId:", courseId);
// //   const res=await axios.get(`${backendUrl}/api/assignments/courseassignments/${courseId}`,{
// //     headers:{
// //       Authorization:`Bearer ${localStorage.getItem("token")}`
// //     }
// //   })
// //   if(res.status===200){
// //     console.log("Assignments data:", res.data.assignments);
// //     setAssignments(res.data.assignments)
// //   }
// //   else{
// //     console.log("Failed to fetch assignments");
// //   }
// // } catch (error) {
// //   console.log("Error fetching assignments:", error.message);
// // }
// //   } 

// //   useEffect(()=>{
// //     getAssignments();
// //   },[])
// //    return (
// //     <div className="flex min-h-screen bg-gray-100 ">
// //       {/* Main Content Area */}
// //       <div className="flex-1 p-6">
// //         {/* Video Player */}
// //         {currentVideo ? (
// //           <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
// //             <h2 className="text-2xl font-bold mb-4">{currentVideo.title}</h2>
// //             {renderVideo(currentVideo)}
// //             <p
// //               className="mt-4 text-gray-700"
// //               dangerouslySetInnerHTML={{ __html: currentVideo.description }}
// //             />
// //           </div>
// //         ) : thumbnail ? (
// //           <img
// //             src={thumbnail}
// //             alt="Course Thumbnail"
// //             className="w-full rounded-lg shadow-lg"
// //           />
// //         ) : (
// //           <p>Loading...</p>
// //         )}
// // {
// // assignments.length>0 && (
// //   <div className="bg-white rounded-lg shadow-lg p-4 mb-6  ">
// //     <h2 className="text-2xl font-bold mb-4  ">Assignments</h2>
// //     <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
// //       {assignments.map((assignment) => (
// //         <div key={assignment._id} className="mb-2 b-2 p-4 border rounded-lg shadow hover:shadow-md transition-shadow duration-300 bg-blue-200">
// //                     <h3 className="text-lg font-semibold">{assignment.assignmentNumber}</h3>

// //           <h3 className="text-lg font-semibold">{assignment.description}</h3>
// //           <p className="text-gray-600">
// //             Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
// //           </p>
// //           <p className="text-gray-600">Total Points: {assignment.totalPoints}</p>
// //         </div>
// //       ))}
// //     </div>
// //   </div>
// // )
// // }
// //         {/* Group Chat Below Video */}
// //         <div className="bg-white rounded-lg shadow-lg p-4">
// //           <h3 className="text-xl font-bold mb-4">Live Discussion</h3>
// //           <GroupChat courseId={courseId} />
// //         </div>
// //       </div>

// //       {/* Playlist Sidebar */}
// //       <div className="w-96 bg-white shadow-lg p-4 overflow-y-auto">
// //         <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2">
// //           Course Playlist
// //         </h2>
// //         <ul className="space-y-2">
// //           {videos.length > 0 ? (
// //             videos.map((video, index) => (
// //               <li
// //                 key={video._id || index}
// //                 className={`cursor-pointer p-3 rounded-lg transition-colors ${
// //                   currentVideo && currentVideo._id === video._id
// //                     ? "bg-blue-500 text-white font-semibold"
// //                     : "hover:bg-gray-100"
// //                 }`}
// //                 onClick={() => setCurrentVideo(video)}
// //               >
// //                 <div className="flex items-start">
// //                   <span className="font-bold mr-2">{index + 1}.</span>
// //                   <span className="flex-1">{video.title}</span>
// //                 </div>
// //               </li>
// //             ))
// //           ) : (
// //             <li className="text-gray-500">No lessons available</li>
// //           )}
// //         </ul>
// //       </div>
// //      </div>
// //   );
// // };

// // export default VideoCourse;



// // // import React, { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import { motion } from "framer-motion";
// // // import GroupChat from "./GroupChat";
// // // import { useNavigate } from "react-router-dom";
// // // const VideoCourse = () => {
// // //   const courseId = window.location.pathname.split("/")[2];
// // //   const backendUrl = import.meta.env.VITE_BACKEND_URL;
// // // const navigate=useNavigate()
// // //   const [videos, setVideos] = useState([]);
// // //   const [thumbnail, setThumbnail] = useState("");
// // //   const [currentVideo, setCurrentVideo] = useState(null);
// // //   const [assignments, setAssignments] = useState([]);

// // //   const getVideo = async () => {
// // //     try {
// // //       const response = await axios.get(`${backendUrl}/api/course/${courseId}`);
// // //       if (response.status === 200) {
// // //         setThumbnail(response.data.thumbnail || "");
// // //         const lessons = response.data.lessons || [];
// // //         setVideos(lessons);
// // //         if (lessons.length > 0) {
// // //           setCurrentVideo(lessons[0]);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching course:", error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     getVideo();
// // //   }, []);

// // //   const getYouTubeEmbedUrl = (url) => {
// // //     try {
// // //       const urlObj = new URL(url);
// // //       if (urlObj.hostname.includes("youtube.com")) {
// // //         const videoId = urlObj.searchParams.get("v");
// // //         return `https://www.youtube.com/embed/${videoId}`;
// // //       } else if (urlObj.hostname.includes("youtu.be")) {
// // //         const videoId = urlObj.pathname.slice(1);
// // //         return `https://www.youtube.com/embed/${videoId}`;
// // //       }
// // //       return null;
// // //     } catch {
// // //       return null;
// // //     }
// // //   };

// // //   const renderVideo = (video) => {
// // //     const ytUrl = getYouTubeEmbedUrl(video.videoUrl);
// // //     if (ytUrl) {
// // //       return (
// // //         <motion.iframe
// // //           key={video._id}
// // //           width="100%"
// // //           height="500"
// // //           src={ytUrl}
// // //           title={video.title}
// // //           frameBorder="0"
// // //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// // //           allowFullScreen
// // //           className="rounded-xl shadow-2xl"
// // //           initial={{ opacity: 0, y: 40 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.6 }}
// // //         ></motion.iframe>
// // //       );
// // //     }

// // //     return (
// // //       <motion.video
// // //         key={video._id}
// // //         src={video.videoUrl}
// // //         controls
// // //         autoPlay
// // //         className="w-full rounded-xl shadow-2xl h-64"
// // //         initial={{ opacity: 0, y: 40 }}
// // //         animate={{ opacity: 1, y: 0 }}
// // //         transition={{ duration: 0.6 }}
// // //       />
// // //     );
// // //   };

// // //   const getAssignments = async () => {
// // //     try {
// // //       console.log("Fetching assignments for courseId:", courseId);
// // //       const res = await axios.get(
// // //         `${backendUrl}/api/assignments/courseassignments/${courseId}`,
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// // //           },
// // //         }
// // //       );
// // //       if (res.status === 200) {
// // //         console.log("Assignments data:", res.data.assignments);
// // //         setAssignments(res.data.assignments);
// // //       } else {
// // //         console.log("Failed to fetch assignments");
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching assignments:", error.message);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     getAssignments();
// // //   }, []);

// // //   return (
// // //     <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
// // //       {/* Main Content */}
// // //       <motion.div
// // //         className="flex-1 p-6 lg:p-10"
// // //         initial={{ opacity: 0 }}
// // //         animate={{ opacity: 1 }}
// // //         transition={{ duration: 0.5 }}
// // //       >
// // //         {/* Video Section */}
// // //         {currentVideo ? (
// // //           <motion.div
// // //             className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100"
// // //             initial={{ scale: 0.97, opacity: 0 }}
// // //             animate={{ scale: 1, opacity: 1 }}
// // //             transition={{ duration: 0.4 }}
// // //           >
// // //             <h2 className="text-3xl font-bold mb-4 text-gray-800">
// // //               {currentVideo.title}
// // //             </h2>
// // //             {renderVideo(currentVideo)}
// // //             <motion.p
// // //               className="mt-6 text-gray-700 leading-relaxed"
// // //               dangerouslySetInnerHTML={{ __html: currentVideo.description }}
// // //               initial={{ opacity: 0 }}
// // //               animate={{ opacity: 1 }}
// // //               transition={{ delay: 0.4 }}
// // //             />
// // //           </motion.div>
// // //         ) : thumbnail ? (
// // //           <motion.img
// // //             src={thumbnail}
// // //             alt="Course Thumbnail"
// // //             className="w-full rounded-3xl shadow-xl"
// // //             initial={{ opacity: 0 }}
// // //             animate={{ opacity: 1 }}
// // //           />
// // //         ) : (
// // //           <p className="text-gray-600 text-center mt-10">Loading...</p>
// // //         )}

// // //         {/* Assignments Section */}
// // //         {assignments.length > 0 && (
// // //           <motion.div
// // //             className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100"
// // //             initial={{ y: 30, opacity: 0 }}
// // //             animate={{ y: 0, opacity: 1 }}
// // //             transition={{ duration: 0.5 }}  
// // //           >
// // //             <h2 className="text-2xl font-bold mb-4 text-gray-800">
// // //               Assignments
// // //             </h2>
// // //             <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1 cursor-pointer">
// // //               {assignments.map((assignment, idx) => (
// // //                // In your assignments.map() section, update the onClick:
// // // <motion.div 
// // //   onClick={() => {
// // //     navigate(`/assignment/byId`, {
// // //       state: { 
// // //         assignmentUrl: assignment.attachments,
// // //         assignmentTitle: assignment.assignmentNumber,
// // //         assignmentDescription: assignment.description
// // //       }
// // //     })
// // //   }}
// // //   key={assignment._id}
// // //   className="p-4 rounded-2xl shadow-md bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
// // //   initial={{ opacity: 0, y: 20 }}
// // //   animate={{ opacity: 1, y: 0 }}
// // //   transition={{ delay: idx * 0.1 }}
// // // >
// // //   <h3 className="text-lg font-semibold text-gray-800">
// // //     {assignment.assignmentNumber}
// // //   </h3>
// // //   <p className="text-gray-700 mt-1">
// // //     {assignment.description}
// // //   </p>
// // //   <p className="text-gray-600 mt-2">
// // //     Due:{" "}
// // //     <span className="font-medium">
// // //       {new Date(assignment.dueDate).toLocaleDateString()}
// // //     </span>
// // //   </p>
// // //   <p className="text-gray-600">
// // //     Points:{" "}
// // //     <span className="font-medium">
// // //       {assignment.totalPoints}
// // //     </span>
// // //   </p>
// // // </motion.div>
// // //               ))}
// // //             </div>
// // //           </motion.div>
// // //         )}

// // //         {/* Chat Section */}
// // //         <motion.div
// // //           className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
// // //           initial={{ opacity: 0, y: 20 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.5 }}
// // //         >
// // //           <h3 className="text-xl font-bold mb-4 text-gray-800">
// // //             💬 Live Discussion
// // //           </h3>
// // //           <GroupChat courseId={courseId} />
// // //         </motion.div>
// // //       </motion.div>

// // //       {/* Sidebar Playlist */}
// // //       <motion.div
// // //         className="w-full lg:w-96 bg-white shadow-xl p-6 overflow-y-auto rounded-t-3xl lg:rounded-none lg:rounded-l-3xl border-l border-gray-100"
// // //         initial={{ x: 50, opacity: 0 }}
// // //         animate={{ x: 0, opacity: 1 }}
// // //         transition={{ duration: 0.5 }}
// // //       >
// // //         <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2 border-b">
// // //           📺 Course Playlist
// // //         </h2>
// // //         <ul className="space-y-2">
// // //           {videos.length > 0 ? (
// // //             videos.map((video, index) => (
// // //               <motion.li
// // //                 key={video._id || index}
// // //                 className={`cursor-pointer p-3 rounded-xl transition-all ${
// // //                   currentVideo && currentVideo._id === video._id
// // //                     ? "bg-blue-500 text-white font-semibold shadow-md"
// // //                     : "hover:bg-blue-50 hover:shadow-sm"
// // //                 }`}
// // //                 onClick={() => setCurrentVideo(video)}
// // //                 whileHover={{ scale: 1.03 }}
// // //                 whileTap={{ scale: 0.98 }}
// // //               >
// // //                 <div className="flex items-start">
// // //                   <span className="font-bold mr-2">{index + 1}.</span>
// // //                   <span className="flex-1">{video.title}</span>
// // //                 </div>
// // //               </motion.li>
// // //             ))
// // //           ) : (
// // //             <li className="text-gray-500 text-center">No lessons available</li>
// // //           )}
// // //         </ul>
// // //       </motion.div>
// // //     </div>
// // //   );
// // // };

// // // export default VideoCourse;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import GroupChat from "./GroupChat";

// const VideoCourse = () => {
//   const courseId = window.location.pathname.split("/")[2];
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [videos, setVideos] = useState([]);
//   const [thumbnail, setThumbnail] = useState("");
//   const [currentVideo, setCurrentVideo] = useState(null);

//   const getVideo = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/course/${courseId}`);

//       if (response.status === 200) {
//         setThumbnail(response.data.thumbnail || "");
//         const lessons = response.data.lessons || [];
//         setVideos(lessons);

//         if (lessons.length > 0) {
//           setCurrentVideo(lessons[0]);
//         }
//       }
//     } catch (error) {
//       console.log("Error fetching course:", error);
//     }
//   };

//   useEffect(() => {
//     getVideo();
//   }, []);

//   const getYouTubeEmbedUrl = (url) => {
//     try {
//       const urlObj = new URL(url);
//       if (urlObj.hostname.includes("youtube.com")) {
//         const videoId = urlObj.searchParams.get("v");
//         return `https://www.youtube.com/embed/${videoId}`;
//       } else if (urlObj.hostname.includes("youtu.be")) {
//         const videoId = urlObj.pathname.slice(1);
//         return `https://www.youtube.com/embed/${videoId}`;
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   };

//   const renderVideo = (video) => {
//     const ytUrl = getYouTubeEmbedUrl(video.videoUrl);
//     if (ytUrl) {
//       return (
//         <iframe
//           width="100%"
//           height="500"
//           src={ytUrl}
//           title={video.title}
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           className="rounded-lg shadow-lg"
//         ></iframe>
//       );
//     }

//     return (
//       <video
//         src={video.videoUrl}
//         controls
//         autoPlay
//         className="w-full rounded-lg shadow-lg h-64 "
//       />
//     );
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 ">
//       {/* Main Content Area */}
//       <div className="flex-1 p-6">
//         {/* Video Player */}
//         {currentVideo ? (
//           <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
//             <h2 className="text-2xl font-bold mb-4">{currentVideo.title}</h2>
//             {renderVideo(currentVideo)}
//             <p
//               className="mt-4 text-gray-700"
//               dangerouslySetInnerHTML={{ __html: currentVideo.description }}
//             />
//           </div>
//         ) : thumbnail ? (
//           <img
//             src={thumbnail}
//             alt="Course Thumbnail"
//             className="w-full rounded-lg shadow-lg"
//           />
//         ) : (
//           <p>Loading...</p>
//         )}

//         {/* Group Chat Below Video */}
//         <div className="bg-white rounded-lg shadow-lg p-4">
//           <h3 className="text-xl font-bold mb-4">Live Discussion</h3>
//           <GroupChat courseId={courseId} />
//         </div>
//       </div>

//       {/* Playlist Sidebar */}
//       <div className="w-96 bg-white shadow-lg p-4 overflow-y-auto">
//         <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2">
//           Course Playlist
//         </h2>
//         <ul className="space-y-2">
//           {videos.length > 0 ? (
//             videos.map((video, index) => (
//               <li
//                 key={video._id || index}
//                 className={`cursor-pointer p-3 rounded-lg transition-colors ${
//                   currentVideo && currentVideo._id === video._id
//                     ? "bg-blue-500 text-white font-semibold"
//                     : "hover:bg-gray-100"
//                 }`}
//                 onClick={() => setCurrentVideo(video)}
//               >
//                 <div className="flex items-start">
//                   <span className="font-bold mr-2">{index + 1}.</span>
//                   <span className="flex-1">{video.title}</span>
//                 </div>
//               </li>
//             ))
//           ) : (
//             <li className="text-gray-500">No lessons available</li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default VideoCourse;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GroupChat from "./GroupChat";

const VideoCourse = () => {
  const courseId = window.location.pathname.split("/")[2];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const getVideo = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/${courseId}`);

      if (response.status === 200) {
        setThumbnail(response.data.thumbnail || "");
        const lessons = response.data.lessons || [];
        setVideos(lessons);

        if (lessons.length > 0) {
          setCurrentVideo(lessons[0]);
        }
      }
    } catch (error) {
      console.log("Error fetching course:", error);
    }
  };

  const getAssignments = async () => {
    try {
      console.log("Fetching assignments for courseId:", courseId);
      const res = await axios.get(
        `${backendUrl}/api/assignments/courseassignments/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        console.log("Assignments data:", res.data.assignments);
        setAssignments(res.data.assignments);
      } else {
        console.log("Failed to fetch assignments");
      }
    } catch (error) {
      console.log("Error fetching assignments:", error.message);
    }
  };

  useEffect(() => {
    getVideo();
    getAssignments();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        const videoId = urlObj.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (urlObj.hostname.includes("youtu.be")) {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const renderVideo = (video) => {
    const ytUrl = getYouTubeEmbedUrl(video.videoUrl);
    if (ytUrl) {
      return (
        <motion.iframe
          key={video._id}
          width="100%"
          height="500"
          src={ytUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
      );
    }

    return (
      <motion.video
        key={video._id}
        src={video.videoUrl}
        controls
        autoPlay
        className="w-full rounded-xl shadow-2xl h-64"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />
    );
  };

  const handleAssignmentClick = (assignment) => {
    console.log("Opening assignment:", assignment);
    navigate(`/assignment/byId`, {
      state: {
        assignmentUrl: assignment.attachments,
        assignmentTitle: assignment.assignmentNumber,
        assignmentDescription: assignment.description,
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Main Content */}
      <motion.div
        className="flex-1 p-6 lg:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Video Section */}
        {currentVideo ? (
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {currentVideo.title}
            </h2>
            {renderVideo(currentVideo)}
            <motion.p
              className="mt-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentVideo.description }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </motion.div>
        ) : thumbnail ? (
          <motion.img
            src={thumbnail}
            alt="Course Thumbnail"
            className="w-full rounded-3xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ) : (
          <p className="text-gray-600 text-center mt-10">Loading...</p>
        )}

        {/* Assignments Section */}
        {assignments.length > 0 && (
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-6 mb-10 border border-gray-100"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📝 Assignments
            </h2>
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
              {assignments.map((assignment, idx) => (
                <motion.div
                  onClick={() => handleAssignmentClick(assignment)}
                  key={assignment._id}
                  className="p-4 rounded-2xl shadow-md bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {assignment.assignmentNumber}
                  </h3>
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {assignment.description}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Due:{" "}
                    <span className="font-medium">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Points:{" "}
                    <span className="font-medium">{assignment.totalPoints}</span>
                  </p>
                  <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                    📄 View Assignment →
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            💬 Live Discussion
          </h3>
          <GroupChat courseId={courseId} />
        </motion.div>
      </motion.div>

      {/* Sidebar Playlist */}
      <motion.div
        className="w-full lg:w-96 bg-white shadow-xl p-6 overflow-y-auto rounded-t-3xl lg:rounded-none lg:rounded-l-3xl border-l border-gray-100"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2 border-b">
          📺 Course Playlist
        </h2>
        <ul className="space-y-2">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <motion.li
                key={video._id || index}
                className={`cursor-pointer p-3 rounded-xl transition-all ${
                  currentVideo && currentVideo._id === video._id
                    ? "bg-blue-500 text-white font-semibold shadow-md"
                    : "hover:bg-blue-50 hover:shadow-sm"
                }`}
                onClick={() => setCurrentVideo(video)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start">
                  <span className="font-bold mr-2">{index + 1}.</span>
                  <span className="flex-1">{video.title}</span>
                </div>
              </motion.li>
            ))
          ) : (
            <li className="text-gray-500 text-center">No lessons available</li>
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default VideoCourse;