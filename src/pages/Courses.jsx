import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Pricing from './Pricing';
const Courses = () => {
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [courses,setCourses]=React.useState([])
    const navigate=useNavigate()
    const findAllCourses=async()=>{
        try {
             const response=await axios.get(`${backendUrl}/api/course`)
        console.log(response.data);
        if(response.data){
            setCourses(response.data.courses)
        }
        } catch (error) {
            console.log(error)
        }
        
    }
    useEffect(()=>{
        findAllCourses()
    },[])
  return (
    <div className='min-h-screen text-2xl font-bold p-4 border-4 border-amber-400'> 
        <h1 className='bg-amber-300 text-white rounded-full p-4'>All Available Courses..</h1>
    <div className='grid grid-cols-4 gap-4 p-4'> 
 
{courses && courses.map((course)=>{
    return(
<div
  key={course._id}
  className="border-2 m-4 p-4 rounded-lg border-yellow-300 border-double hover:scale-105 hover:shadow-lg transition-transform"
  onClick={() => {
    if (course.price === 0) {
      window.location.href = `/course/${course._id}`;
    } else {
      navigate('/pricing',{state:{course:course}})
    }
  }}
>            <h2 className='text-xl font-bold  '>{course.title}</h2>
            <p className='text-gray-600 text-sm'>{course.description.replace(/<[^>]+>/g,"")}</p>
 
<div className='   '> 
    <p className='text-gray-800 font-semibold text-sm'>
  by {course.instructor?.name || "Unknown Instructor"} 
   <img src={course.instructor?.pic || ""} alt={course.title} className=' h-14 w-14 object-cover rounded-lg mt-2'/>

</p>
         </div>
                    <p className='text-gray-800 font-bold text-sm'>Price: ${course.price}</p>

        </div>
    )
})}
    </div>
    </div>
  )
}

export default Courses