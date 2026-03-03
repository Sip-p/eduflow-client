import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay }
  })
};

const LandingPage = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-6 md:px-12 py-5 shadow-sm bg-white"
      >
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
          Edu<span className="text-slate-900">Flow</span>
        </h1>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <button className="hover:text-blue-600 transition" onClick={() => navigate(user?"/courses":"/login")}>
            Courses
          </button>
          <button className="hover:text-blue-600 transition" onClick={() => navigate("/about")}>
            About
          </button>
        </div>

        <button
          onClick={() => navigate(user ? "/dashboard" : "/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow"
        >
          {user ? "Dashboard" : "Get Started"}
        </button>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="uppercase tracking-widest text-blue-300 text-xs font-semibold"
            >
              Modern Learning Platform
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="text-4xl md:text-6xl font-extrabold leading-tight mt-6"
            >
              Empowering <br />
              <span className="text-blue-400">Students & Educators</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
              className="mt-6 text-blue-100 max-w-lg text-lg leading-relaxed"
            >
              EduFlow connects learners and teachers on one powerful platform —
              build skills, share knowledge, and grow together.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.6}
              className="flex gap-4 mt-8 flex-wrap"
            >
              <button
                onClick={() => navigate("/course")}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition hover:scale-105"
              >
                Start Learning
              </button>

              <button
                onClick={() => navigate("/teach")}
                className="border border-blue-300 hover:bg-blue-600 hover:border-blue-600 px-6 py-3 rounded-lg font-semibold transition hover:scale-105"
              >
                Become Instructor
              </button>
            </motion.div>
          </div>

          {/* Right Image with floating animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
              alt="Students"
              className="rounded-2xl shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-xl shadow-xl p-5 w-56"
            >
              <p className="text-sm font-medium text-slate-500">
                Satisfaction Rate
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-1">98%</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= STUDENT & TEACHER SECTION ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12">

          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 bg-blue-50 rounded-2xl shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              👩‍🎓 For Students
            </h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              <li>✔ Job-ready structured courses</li>
              <li>✔ Industry-recognized certificates</li>
              <li>✔ Learn anytime, anywhere</li>
              <li>✔ Track your progress</li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 bg-slate-900 text-white rounded-2xl shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-blue-400">
              👨‍🏫 For Educators
            </h2>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>✔ Create and manage courses</li>
              <li>✔ Earn from enrollments</li>
              <li>✔ Build your audience</li>
              <li>✔ Reach students worldwide</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          {["40K+ Learners", "5K+ Educators", "1,200+ Courses", "180+ Countries"].map(
            (item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-extrabold text-blue-600">
                  {item.split(" ")[0]}
                </h2>
                <p className="text-slate-600 mt-2 text-sm">
                  {item.split(" ").slice(1).join(" ")}
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Join EduFlow Today
        </motion.h2>

        <p className="mt-4 text-blue-100">
          Start learning or teaching — the future begins here.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
        >
          Get Started
        </button>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-sm">
        © {new Date().getFullYear()} EduFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;