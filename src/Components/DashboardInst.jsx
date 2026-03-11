import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import {
  BookOpen,
  Users,
  DollarSign,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";

const DashboardInst = () => {
  // 🔹 Animated display values
  const [courses, setCourses] = useState(0);
  const [students, setStudents] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [assignments, setAssignments] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [completion, setCompletion] = useState(0);

  // 🔹 Actual backend values (targets)
  const [targets, setTargets] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalAssignments: 0,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const { user, token, isAuthenticated } = useAuthStore();
  const getalldashboarddata = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/course/instructor-dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Dashboard API:", res.data); // 🔍 Debug

      if (res.data.success && res.data.data) {
        const {
          totalCourses,
          totalStudents,
          totalRevenue,
          totalAssignments,
        } = res.data.data;

        setTargets({
          totalCourses: totalCourses || 0,
          totalStudents: totalStudents || 0,
          totalRevenue: totalRevenue || 0,
          totalAssignments: totalAssignments || 0,
        });

        // Static demo values (optional)
        setQuizzes(6);
        setCompletion(85);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    getalldashboarddata();
  }, []);

  // 🔹 Smooth Count Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCourses((prev) =>
        prev < targets.totalCourses ? prev + 1 : targets.totalCourses
      );

      setStudents((prev) =>
        prev < targets.totalStudents ? prev + 1 : targets.totalStudents
      );

      setRevenue((prev) =>
        prev < targets.totalRevenue
          ? prev + Math.ceil(targets.totalRevenue / 50)
          : targets.totalRevenue
      );

      setAssignments((prev) =>
        prev < targets.totalAssignments ? prev + 1 : targets.totalAssignments
      );
    }, 30);

    return () => clearInterval(interval);
  }, [targets]);

  return (
    <div className="bg-gradient-to-br from-blue-200 to-blue-400 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Instructor Dashboard
      </h1>

      <ul className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
        <DashboardCard
          color="bg-purple-400"
          icon={<BookOpen className="w-8 h-8 text-white" />}
          title="Total Courses"
          value={courses}
        />

        <DashboardCard
          color="bg-blue-400"
          icon={<Users className="w-8 h-8 text-white" />}
          title="Total Students"
          value={students}
        />

        <DashboardCard
          color="bg-green-400"
          icon={<DollarSign className="w-8 h-8 text-white" />}
          title="Revenue"
          value={`₹${revenue.toLocaleString()}`}
        />

        <DashboardCard
          color="bg-orange-400"
          icon={<FileText className="w-8 h-8 text-white" />}
          title="Assignments"
          value={assignments}
        />

        <DashboardCard
          color="bg-pink-400"
          icon={<Award className="w-8 h-8 text-white" />}
          title="Active Quizzes"
          value={quizzes}
        />

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

// 🔹 Reusable Card Component
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