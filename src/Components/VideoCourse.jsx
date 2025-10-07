import React, { useEffect, useState } from "react";
import axios from "axios";
import GroupChat from "./GroupChat";

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

  useEffect(() => {
    getVideo();
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
        <iframe
          width="100%"
          height="500"
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
      <video
        src={video.videoUrl}
        controls
        autoPlay
        className="w-full rounded-lg shadow-lg h-64 "
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Video Player */}
        {currentVideo ? (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <h2 className="text-2xl font-bold mb-4">{currentVideo.title}</h2>
            {renderVideo(currentVideo)}
            <p
              className="mt-4 text-gray-700"
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

        {/* Group Chat Below Video */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xl font-bold mb-4">Live Discussion</h3>
          <GroupChat courseId={courseId} />
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="w-96 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2">
          Course Playlist
        </h2>
        <ul className="space-y-2">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <li
                key={video._id || index}
                className={`cursor-pointer p-3 rounded-lg transition-colors ${
                  currentVideo && currentVideo._id === video._id
                    ? "bg-blue-500 text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentVideo(video)}
              >
                <div className="flex items-start">
                  <span className="font-bold mr-2">{index + 1}.</span>
                  <span className="flex-1">{video.title}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No lessons available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VideoCourse;