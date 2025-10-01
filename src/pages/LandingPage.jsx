import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
const LandingPage = () => {
  return (
    <div className='h-screen'> 
      <Navbar/>
      
      {/* Main hero section with curved background */}
      <div className='relative h-1/2 bg-gradient-to-r from-blue-600 to-cyan-400 overflow-hidden'> 
        
        
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-b-full transform scale-150 -translate-y-1/3 bg-clip-content-'>
        </div>

       
        {/* Content */}
        <div className='relative z-10 flex flex-col justify-center items-center text-white h-full pt-9'>
          <h1 className='text-2xl font-bold'>Learn Without Limits</h1>
          
          <p className='text-center px-4'>
            Join thousands of learners from around the world already learning on EduPlatform
          </p>
          
          <div className='mt-4'>
            <button className='bg-orange-500 p-2 rounded-full px-6 m-3 text-white hover:bg-orange-700 transition-colors'>
              Browse Courses
            </button>
            <button className='bg-white p-2 rounded-full px-6 m-3 text-black hover:bg-gray-100 transition-colors'>
              Get Started
            </button>
          </div>
          
          <div className='flex justify-center items-center text-white gap-8 mt-6'> 
            <div className='flex gap-6 text-white'>
              <button className='hover:text-orange-300 transition-colors'>Design</button>
              <button className='hover:text-orange-300 transition-colors'>Development</button>
              <button className='hover:text-orange-300 transition-colors'>Business</button>
            </div>
            <div className='flex gap-2'>
              <button className='w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors'>
                ◀
              </button>
              <button className='w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors'>
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className='bg-white p-8 flex  justify-evenly items-center'>
        <div className='text-center mb-8'>
<h1>Testimonials</h1>
<div className='grid grid-cols-2 gap-4 mt-4 max-md:grid-cols-1'>
  <div className='bg-blue-400'>
    <p>"This platform transformed my career!"</p>
    <p>- Alex P.</p>

  </div>
  <div className='bg-blue-400'>
    <p>"This platform transformed my career!"</p>
    <p>- Alex P.</p>

  </div>
  <div className='bg-blue-400'>
    <p>"This platform transformed my career!"</p>
    <p>- Alex P.</p>

  </div>
  <div className='bg-blue-400'>
    <p>"This platform transformed my career!"</p>
    <p>- Alex P.</p>

  </div>

</div>
        </div>
         <div className='mx-9 mb-8' >
<h1>Featured Instructor</h1>
<div className='grid grid-cols-3 gap-3 mt-4'>
  <div className='   '>
    <img src="https://img.freepik.com/free-photo/young-handsome-designer-working-computer_23-2148995221.jpg?w=740&t=st=1696203603~exp=1696204203~hmac=3a4f4e5f6c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4" alt="Instructor" className='w-16 h-16 rounded-full bg-gray-500'/>
  <h1>Name</h1>
 <p className='text-gray-500'>xyz</p>  </div>
  <div>
    <img src="https://img.freepik.com/free-photo/young-handsome-designer-working-computer_23-2148995221.jpg?w=740&t=st=1696203603~exp=1696204203~hmac=3a4f4e5f6c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4" alt="Instructor" className='w-16 h-16 rounded-full'/>
 <h1>Name</h1>
 <p className='text-gray-500'>xyz</p>  </div>
  <div>
    <img src="https://img.freepik.com/free-photo/young-handsome-designer-working-computer_23-2148995221.jpg?w=740&t=st=1696203603~exp=1696204203~hmac=3a4f4e5f6c7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4" alt="Instructor" className='w-16 h-16 rounded-full'/>
  <h1>Name</h1>
 <p className='text-gray-500'>xyz</p>
  </div>
  
</div>
        </div>
       </div>
      <div className='absolute bottom-0 w-full'>
      <Footer/>
      </div>
    </div>
  )
}

export default LandingPage