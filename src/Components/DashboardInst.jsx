import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Users,
  DollarSign,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardInst = () => {
  const [courses, setCourses] = useState(0);
  const [students, setStudents] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [assignments, setAssignments] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [completion, setCompletion] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const getalldashboarddata = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/course/instructor-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.data) {
        const { totalCourses, totalStudents, totalAssignments } = res.data.data;

        // 🧮 Update states
        setCourses(totalCourses || 0);
        setStudents(totalStudents || 0);
        setAssignments(totalAssignments || 0);
        setRevenue(totalCourses * 5000); // optional mock logic
        setQuizzes(6); // static demo value or dynamic from backend later
        setCompletion(85); // mock completion percentage
      } else {
        setCourses(0);
        setStudents(0);
        setAssignments(0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
      setCourses(0);
      setStudents(0);
      setAssignments(0);
    }
  };

  useEffect(() => {
    getalldashboarddata();
  }, []);

  // 🕒 Animate values counting up smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setCourses((prev) => (prev < courses ? prev + 1 : courses));
      setStudents((prev) => (prev < students ? prev + 1 : students));
      setRevenue((prev) => (prev < revenue ? prev + 500 : revenue));
      setAssignments((prev) => (prev < assignments ? prev + 1 : assignments));
      setQuizzes((prev) => (prev < quizzes ? prev + 1 : quizzes));
      setCompletion((prev) => (prev < completion ? prev + 1 : completion));
    }, 50);

    return () => clearInterval(interval);
  }, [courses, students, assignments, revenue, quizzes, completion]);

  return (
    <div className="bg-gradient-to-br from-blue-200 to-blue-400 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Instructor Dashboard</h1>

      <ul className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
        {/* Total Courses */}
        <DashboardCard
          color="bg-purple-400"
          icon={<BookOpen className="w-8 h-8 text-white" />}
          title="Total Courses"
          value={courses}
        />

        {/* Total Students */}
        <DashboardCard
          color="bg-blue-400"
          icon={<Users className="w-8 h-8 text-white" />}
          title="Total Students"
          value={students}
        />

        {/* Revenue */}
        <DashboardCard
          color="bg-green-400"
          icon={<DollarSign className="w-8 h-8 text-white" />}
          title="Revenue"
          value={`₹${revenue.toLocaleString()}`}
        />

        {/* Assignments */}
        <DashboardCard
          color="bg-orange-400"
          icon={<FileText className="w-8 h-8 text-white" />}
          title="Assignments"
          value={assignments}
        />

        {/* Quizzes */}
        <DashboardCard
          color="bg-pink-400"
          icon={<Award className="w-8 h-8 text-white" />}
          title="Active Quizzes"
          value={quizzes}
        />

        {/* Completion Rate */}
        <DashboardCard
          color="bg-yellow-400"
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          title="Completion Rate"
          value={`${completion}%`}
        />
      </ul>
    </div>
  );
};

// ✅ Reusable card component for clean UI
const DashboardCard = ({ color, icon, title, value }) => (
  <motion.li
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
    className="bg-white flex items-center justify-between p-6 rounded-2xl shadow-md hover:shadow-xl"
  >
    <div className="flex items-center gap-4">
      <div className={`${color} p-3 rounded-xl`}>{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </motion.li>
);

export default DashboardInst;
