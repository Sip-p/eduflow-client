import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Bar, Line } from 'react-chartjs-2';
// register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const MyQuizzes = () => {
    const user=JSON.parse(localStorage.getItem("user"))
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const token=localStorage.getItem("token")
    const [attemptedQuizzes,setAttemptedQuizzes]=React.useState([])

    const scores = attemptedQuizzes.map(q => q.score);
const quizTitles = attemptedQuizzes.map(q => q.quizId.title);
//  console.log(quizTitles)
const dates = attemptedQuizzes.map(q => new Date(q.attemptedAt).toLocaleDateString());
 const lineData = {
  labels: dates,
  datasets: [
    {
      label: 'Score Over Time',
      data: scores,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
};

const barData = {
  labels: quizTitles,
  datasets: [
    {
      label: 'Quiz Scores',
      data: scores,
      backgroundColor: 'rgba(10, 100, 255, 0.81)',
    }
  ]
};

    const findattempteduizzes=async()=>{
        try {
      const res=await axios.get(`${backendUrl}/api/quiz/myattemptedquizzes`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      const data=res.data
      console.log(data)
      setAttemptedQuizzes(data.attemptedQuizzes)
       } catch (error) {
            console.log("Error fetching attempted quizzes:", error);
        }

    }
    useEffect(()=>{
        findattempteduizzes()
    },[])
  return (
    <div className='bg-sky-100 m-2 p-3 rounded-lg shadow'> 
{
  attemptedQuizzes && attemptedQuizzes.length>0?(
    <div>
    <h2 className='text-2xl font-bold mb-4'>My Attempted Quizzes</h2>
    <ul>
      {attemptedQuizzes.map((quiz) => (
        <li key={quiz._id} className="  p-4 mb-4 rounded shadow hover:scale-101 transition-transform duration-500 ease-out 2s bg-sky-300" >
          <p className="text-gray-600 font-bold">{quiz.quizId.title}</p>
          <p className="text-gray-600">Score: {quiz.score}</p>
           <p className="text-gray-600">Date Attempted: {new Date(quiz.attemptedAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  </div>
  ):(<div>
    <h2 className='text-2xl font-bold mb-4'>My Attempted Quizzes</h2>
    <p>You have not attempted any quizzes yet.</p>

      </div>)
  
}

<div>
    <h2 className="text-2xl font-bold mb-4">Performance Analytics</h2>

 
<div className="mt-4 grid max-md:grid-cols-1 grid-cols-2 gap-4">
   
  <div className="bg-white p-2 rounded shadow mb-3">
    <h3 className="text-lg font-semibold mb-2">Score Growth Over Time</h3>
    <Line data={lineData} />
  </div>

  <div className="bg-white p-2 rounded shadow">
    <h3 className="text-lg font-semibold mb-2">Scores by Quiz</h3>
    <Bar data={barData} />
  </div>
</div>
</div>
    </div>
  )
}

export default MyQuizzes