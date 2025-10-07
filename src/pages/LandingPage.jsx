import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import AllReviews from '../Components/AllReviews'
import { useNavigate } from 'react-router-dom'
const LandingPage = () => {
  const navigate=useNavigate()
  const user=localStorage.getItem("user")
  const handleClick=async()=>{
    if(user){
      navigate('/course')
    }
    else{
      alert('please login/signup')
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-r from-blue-600 to-cyan-400 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-b-full transform scale-150 -translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white h-full px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold">Learn Without Limits</h1>
          <p className="mt-2 max-w-2xl">
            Join thousands of learners from around the world already learning on EduPlatform
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button className="bg-orange-500 py-2 px-6 rounded-full text-white hover:bg-orange-700 transition-colors" onClick={()=>handleClick()}>
              Browse Courses
            </button>
            <button className="bg-white py-2 px-6 rounded-full text-black hover:bg-gray-100 transition-colors" onClick={()=>navigate('/home')}>
              Get Started
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center text-white gap-6 mt-6">
            {/* Categories */}
            <div className="flex gap-6">
              <button className="hover:text-orange-300 transition-colors">Design</button>
              <button className="hover:text-orange-300 transition-colors">Development</button>
              <button className="hover:text-orange-300 transition-colors">Business</button>
            </div>

            {/* Slider buttons */}
           
          </div>
        </div>
      </div>

      {/* Testimonials + Featured Instructor */}
         {/* Testimonials */}
      
       
     
              <AllReviews />
          
 
         

        {/* Featured Instructor */}
         
 
      <Footer />
    </div>
  )
}

export default LandingPage



// import { useState } from 'react';

// export default function LandingPage() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const numColumns = 3; // Number of vertical slices

//   const handleClick = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-700 overflow-hidden relative">
//       {/* Small image in corner */}
//       {!isExpanded && (
//         <div
//           onClick={handleClick}
//           className="absolute top-8 left-8 w-32 h-32 cursor-pointer hover:scale-105 transition-transform duration-300"
//         >
//           <img
//             src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
//             alt="Mountain landscape"
//             className="w-full h-full object-cover rounded-lg shadow-2xl"
//           />
//         </div>
//       )}

//       {/* Expanded split columns that join together */}
//       {isExpanded && (
//         <div 
//           className="absolute right-0 top-1/2 transform -translate-y-1/2 flex cursor-pointer"
//           onClick={handleClick}
//           style={{ width: '80%', height: '80%' }}
//         >
//           {[...Array(numColumns)].map((_, i) => (
//             <div
//               key={i}
//               className="flex-1 h-full overflow-hidden animate-slide-join"
//               style={{
//                 animationDelay: `${i * 0.1}s`
//               }}
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1200&fit=crop"
//                 alt={`Mountain slice ${i}`}
//                 className="h-full object-cover"
//                 style={{
//                   width: `${numColumns * 100}%`,
//                   objectPosition: `${(i / (numColumns - 1)) * 100}% center`,
//                   marginLeft: `-${i * 100}%`
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Instructions */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center bg-black bg-opacity-50 px-6 py-3 rounded-full z-10">
//         <p className="text-sm">
//           {isExpanded ? 'Click to collapse' : 'Click the image to see it split and expand'}
//         </p>
//       </div>

//       <style jsx>{`
//         @keyframes slideJoin {
//           0% {
//             transform: translateX(-800px);
//             opacity: 0;
//           }
//           100% {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         .animate-slide-join {
//           animation: slideJoin 0.8s ease-out forwards;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// }