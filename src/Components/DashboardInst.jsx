import React from 'react'

const DashboardInst = () => {
  const user=JSON.parse(localStorage.getItem("user"))
  return (
    <div> 
        <div className='grid grid-cols-3 gap-4 mt-4 max-md:grid-cols-1'>
<div className='bg-blue-400 p-4 rounded-lg'>
<h1>Enrolled courses</h1>
</div>
<div className='bg-blue-400 p-4 rounded-lg'>
<h1>Completed courses</h1>
</div>
<div className='bg-blue-400 p-4 rounded-lg'>
<h1>Continue Learning</h1>
</div>
 
        </div  >
        <div className='mt-8'> 
        <h1>Courses You can explore...</h1>
         
        <div  className='grid grid-cols-3 gap-4 mt-4 max-md:grid-cols-1'>
 
<div className='bg-blue-400 p-4 rounded-lg'>
<h1>Course 1</h1>
</div>
<div className='bg-blue-400 p-4 rounded-lg'>
<h1>Course 1</h1>
</div>
<div className='bg-blue-400 p-4 rounded-lg'>
<h1>Course 1</h1>
</div>
</div>
</div>
    </div>
  )
}

export default DashboardInst