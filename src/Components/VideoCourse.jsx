import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from 'react-icons/fa';

const VideoCourse = () => {
  const courseId = window.location.pathname.split("/")[2];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [videos, setVideos] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);

  const getVideo = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/${courseId}`);

      if (response.status === 200) {
        console.log("Fetched course:", response.data);

        setThumbnail(response.data.thumbnail || "");
        const lessons = response.data.lessons || [];
        setVideos(lessons);

        // Play first video by default
        if (lessons.length > 0) {
          setCurrentVideo(lessons[0]);
        }
      }
    } catch (error) {
      console.log("Error fetching course:", error);
    }
  };

  useEffect(() => {
    getVideo();
  }, []);

  // Convert YouTube links to embed
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
      return null; // not YouTube
    } catch {
      return null;
    }
  };

  // Decide whether to render iframe or video
  const renderVideo = (video) => {
    const ytUrl = getYouTubeEmbedUrl(video.videoUrl);
    if (ytUrl) {
      return (
        <iframe
          width="100%"
          height="400"
          src={ytUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      );
    }

    return (
      <> 
      <video
        src={video.videoUrl}
        controls
        autoPlay
        className="w-full max-h-96 rounded-lg shadow-lg object-contain"
      />
<FaCheckCircle className="bg-yellow-200"/>
      </>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Main Video Section */}
      <div className="flex-1 p-6">
        {currentVideo ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentVideo.title}</h2>
            {renderVideo(currentVideo)}

            <p
              className="mt-3 text-gray-700"
              dangerouslySetInnerHTML={{ __html: currentVideo.description }}
            />
          </div>
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt="Course Thumbnail"
            className="w-full rounded-lg shadow-lg"
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Playlist Sidebar */}
      <div className="w-full md:w-1/3 bg-white shadow-lg p-4 border-l border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Course Playlist</h2>
        <ul className="space-y-2">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <li
                key={video._id || index}
                className={`cursor-pointer p-2 rounded-lg ${
                  currentVideo && currentVideo._id === video._id
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentVideo(video)}
              >
                {index + 1}. {video.title}
              </li>
            ))
          ) : (
            <li>No lessons available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VideoCourse;
