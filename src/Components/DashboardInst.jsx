import React, { useEffect, useState } from "react";
import axios from 'axios'
import {
  BookOpen,
  Users,
  DollarSign,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
const token=localStorage.getItem("token")
const DashboardInst = () => {
  const [courses, setCourses] = useState(0);
  const [cousenum,setCoursenum]=useState(0)
  const [students, setStudents] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [assignments, setAssignments] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [completion, setCompletion] = useState(0);
const backendUrl=import.meta.env.VITE_BACKEND_URL

  const getCourseNumber = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/course/instructor-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // handle response shape: either an array or { success, courses }
      const coursesArray = Array.isArray(res.data)
        ? res.data
        : (res.data?.courses || []);

      setCoursenum(coursesArray.length);
    } catch (error) {
      console.log(error.message);
      setCoursenum(0);
    }
  };
  // simple count-up animation for all stats

useEffect(()=>{
  getCourseNumber()
},[])
  useEffect(() => {
    const interval = setInterval(() => {
      setCourses((prev) => (prev < cousenum ? prev + 1 : cousenum));
      setStudents((prev) => (prev < 345 ? prev + 5 : 345));
      setRevenue((prev) => (prev < 75800 ? prev + 900 : 75800));
      setAssignments((prev) => (prev < 18 ? prev + 1 : 18));
      setQuizzes((prev) => (prev < 6 ? prev + 1 : 6));
      setCompletion((prev) => (prev < 86 ? prev + 2 : 86));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-200 to-blue-400 min-h-screen p-6">
      

      <ul className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
        <motion.li
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-400 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Total Courses
              </h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">{courses}</p>
            </div>
          </div>
        </motion.li>

        <motion.li
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-400 p-3 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Total Students
              </h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {students}
              </p>
            </div>
          </div>
        </motion.li>

        <motion.li
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-400 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.li>

        <motion.li
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-400 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Assignments
              </h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {assignments}
              </p>
            </div>
          </div>
        </motion.li>

        <motion.li
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-pink-400 p-3 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Active Quizzes
              </h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">{quizzes}</p>
            </div>
          </div>
        </motion.li>

        <motion.li
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Completion Rate
              </h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {completion}%
              </p>
            </div>
          </div>
        </motion.li>
      </ul>
    </div>
  );
};

export default DashboardInst;
