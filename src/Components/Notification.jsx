// src/components/Notification.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from 'axios'
const socket = io("http://localhost:3000"); // ✅ backend URL
const backendUrl=import.meta.env.VITE_BACKEND_URL
 const Notification=()=>{
  const [notification,setNotification]=useState([])
  const user=JSON.parse(localStorage.getItem("user"))
  const userId=user.id
const getAllnotifications=async(req,res)=>{
const response=await axios.get(`${backendUrl}/api/notification`,{
userId
}) 
console.log(response)
}
useEffect(()=>{
getAllnotifications()
},[ ])
  return(
<div>

</div>
  )
 }

export default Notification;
