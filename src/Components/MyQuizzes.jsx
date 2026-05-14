import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { useAuthStore } from '../store/useAuthStore';
const MyQuizzes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { token } = useAuthStore();

  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttemptedQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/quiz/myattemptedquizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data)
      setAttemptedQuizzes(res.data.myattemptedQuizzes || []);
    } catch (err) {
      console.error('Error fetching attempted quizzes:', err);
      setError('Failed to load your quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttemptedQuizzes();
  }, []);

  // Derived stats
  const scores = attemptedQuizzes.map(q => q.score);
  const quizTitles = attemptedQuizzes.map(q => q.quizId?.title ?? 'Untitled');
  const dates = attemptedQuizzes.map(q => new Date(q.attemptedAt).toLocaleDateString());

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const totalAttempts = scores.length;

  const lineData = {
    labels: dates,
    datasets: [{
      label: 'Score Over Time',
      data: scores,
      fill: true,
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      borderColor: 'rgba(99, 102, 241, 0.9)',
      pointBackgroundColor: 'rgba(99, 102, 241, 1)',
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4
    }]
  };

  const barData = {
    labels: quizTitles,
    datasets: [{
      label: 'Score',
      data: scores,
      backgroundColor: scores.map(s =>
        s >= 80 ? 'rgba(34, 197, 94, 0.75)' :
          s >= 60 ? 'rgba(234, 179, 8, 0.75)' :
            'rgba(239, 68, 68, 0.75)'
      ),
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#e0e7ff',
        bodyColor: '#c7d2fe',
        cornerRadius: 8,
        padding: 10,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#6b7280' }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#6b7280',
          maxRotation: 30,
          callback: function (val, i) {
            const label = this.getLabelForValue(val);
            return label.length > 12 ? label.slice(0, 12) + '…' : label;
          }
        }
      }
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Excellent', cls: 'bg-green-100 text-green-700' };
    if (score >= 60) return { label: 'Pass', cls: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Needs Work', cls: 'bg-red-100 text-red-700' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48 bg-slate-50 rounded-xl m-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading your quizzes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center gap-3">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchAttemptedQuizzes}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Quizzes</h1>
        <p className="text-slate-500 mt-1 text-sm">
          {user?.name ? `Welcome back, ${user.name}!` : 'Your quiz history & performance'}
        </p>
      </div>

      {/* Stats Cards */}
      {attemptedQuizzes.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Attempts', value: totalAttempts, color: 'bg-indigo-50 text-indigo-700', icon: '📝' },
            { label: 'Average Score', value: `${avgScore}`, color: 'bg-amber-50 text-amber-700', icon: '📊' },
            { label: 'Best Score', value: `${bestScore}`, color: 'bg-green-50 text-green-700', icon: '🏆' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color} flex flex-col gap-1`}>
              <span className="text-xl">{stat.icon}</span>
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs font-medium opacity-80">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quiz List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Attempted Quizzes</h2>

        {attemptedQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-slate-600 font-medium">No quizzes attempted yet</p>
            <p className="text-slate-400 text-sm mt-1">Complete your first quiz to see results here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attemptedQuizzes.map((quiz, idx) => {
              const badge = getScoreBadge(quiz.score);
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div>
                    {console.log(quiz.id)}
                    <p className="font-semibold text-slate-800">{quiz.id ? quiz.title : 'Untitled Quiz'}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {new Date(quiz.attemptedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
                      {badge.label}
                    </span> */}
                    <span className="text-2xl font-bold text-slate-800">{quiz.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Charts */}
      {attemptedQuizzes.length > 1 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Performance Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-600 mb-4">Score Growth Over Time</h3>
              <Line data={lineData} options={chartOptions} />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-600 mb-4">Scores by Quiz</h3>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;