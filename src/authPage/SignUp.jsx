// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
// import { authService }  from "../services/authService";

// const Signup = () => {
//   const { login } = useAuthStore();
//   const navigate  = useNavigate();
//   const fileRef   = useRef(null);
 
//   const [formData, setFormData] = useState({
//     name: "", email: "", password: "", confirmPassword: "", role: "",
//   });
//   const [picFile,    setPicFile]    = useState(null);
//   const [picPreview, setPicPreview] = useState(null);
//   const [isLoading,  setIsLoading]  = useState(false);
//   const [error,      setError]      = useState("");

//   const handleChange = (e) =>
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePicChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setPicFile(file);
//     setPicPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword)
//       return setError("Passwords do not match");
//     if (!formData.role)
//       return setError("Please select a role");
//     if (!picFile)
//       return setError("Please upload a profile picture");

//     setIsLoading(true);
//     setError("");
//     try {
//       // Build FormData — multer reads this on the backend
//       const form = new FormData();
//       form.append("name",     formData.name);
//       form.append("email",    formData.email);
//       form.append("password", formData.password);
//       form.append("role",     formData.role);
//       form.append("file",     picFile);          // multer field name is "file"

//       const data = await authService.registerWithForm(form);
//       console.log("SIGNUP RESPONSE:", data);
//       login(data.user, data.token);

//       if (data.user.role === "student")      navigate("/student-dashboard");
//       else if (data.user.role === "teacher") navigate("/instructor-dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//  const getPasswordScore=(password)=>{
//   let score=0;
//   if(password.length>=8) score++;
//   if(/[A-Z]/.test(password)) score++;
//   if(/[a-z]/.test(password)) score++;
//   if(/\d/.test(password)) score++;
//   if(/[@$!%*?&]/.test(password)) score++;
//   return score;
//  }

// const getStrength = (password) => {
//   const score = getPasswordScore(password);
//   if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
//   if (score === 3) return { label: "Medium", color: "bg-yellow-500", width: "w-2/4" };
//   if (score === 4) return { label: "Strong", color: "bg-blue-500", width: "w-3/4" };
//   if (score >= 5) return { label: "Very Strong", color: "bg-green-600", width: "w-full" };
// };
//    const strength = getStrength(formData.password);

//   return (
//     <>
//       <style>{`
//         .pic-ring {
//           width: 88px; height: 88px; border-radius: 50%;
//           border: 2px dashed #c7d2fe;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer; overflow: hidden; transition: border-color .2s;
//           margin: 0 auto 4px;
//           background: #f5f3ff;
//         }
//         .pic-ring:hover { border-color: #6366f1; }
//         .pic-ring img { width: 100%; height: 100%; object-fit: cover; }
//         .pic-hint { font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 16px; }
//       `}</style>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {error && (
//           <div className="bg-red-100 text-red-600 text-sm rounded-lg p-3 border border-red-200">
//             {error}
//           </div>
//         )}

//         {/* ── Profile pic ── */}
//         <input
//           ref={fileRef} type="file" accept="image/*"
//           onChange={handlePicChange} style={{ display: "none" }}
//         />
//         <div className="pic-ring" onClick={() => fileRef.current.click()}>
//           {picPreview
//             ? <img src={picPreview} alt="preview" />
//             : <span style={{ fontSize: 28 }}>📷</span>
//           }
//         </div>
//         <p className="pic-hint">
//           {picPreview ? "Tap to change photo" : "Tap to upload profile photo *"}
//         </p>

//         {/* ── Text fields ── */}
//         <input
//           type="text" name="name" placeholder="Full Name"
//           onChange={handleChange} required
//           className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
//         />
//         <input
//           type="email" name="email" placeholder="Email Address"
//           onChange={handleChange} required
//           className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
//         />
 
// <input
//   type="password"
//   name="password"
//   placeholder="Password"
//   onChange={handleChange}
//   required
//   className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
// />

// {/* Strength Bar */}
// <div className="mt-2">
//   <div className="h-2 w-full bg-gray-200 rounded">
//     <div
//       className={`h-2 rounded transition-all duration-300 ${strength?.color} ${strength?.width}`}
//     ></div>
//   </div>
//   <p className="text-xs mt-1 text-gray-600">
//     Strength: {strength?.label || ""}
//   </p>
// </div>
//         <input
//           type="password" name="confirmPassword" placeholder="Confirm Password"
//           onChange={handleChange} required
//           className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
//         />

//         {/* ── Role selector ── */}
//         <div className="flex gap-3">
//           {["student", "teacher"].map((r) => (
//             <button
//               key={r} type="button"
//               onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
//               className={`flex-1 py-2 rounded-lg border-2 capitalize font-medium transition ${
//                 formData.role === r
//                   ? "border-indigo-600 bg-indigo-50 text-indigo-700"
//                   : "border-gray-200 text-gray-500 hover:border-indigo-300"
//               }`}
//             >
//               {r === "student" ? "🎓 Student" : "🏫 Instructor"}
//             </button>
//           ))}
//         </div>

//         <button
//           type="submit" disabled={isLoading}
//           className={`w-full py-3 rounded-lg text-white transition ${
//             isLoading
//               ? "bg-gray-400"
//               : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//           }`}
//         >
//           {isLoading ? "Creating Account..." : "Sign Up"}
//         </button>

//       </form>
//     </>
//   );
// };

// export default Signup;


import React, { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { authService }  from "../services/authService";

const Signup = () => {
  // ✅ removed login and navigate — not needed after signup anymore
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "",
  });
  const [picFile,    setPicFile]    = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(""); // ✅ new state

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    if (!formData.role)
      return setError("Please select a role");
    if (!picFile)
      return setError("Please upload a profile picture");

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      form.append("name",     formData.name);
      form.append("email",    formData.email);
      form.append("password", formData.password);
      form.append("role",     formData.role);
      form.append("file",     picFile);

      const data = await authService.registerWithForm(form);

      // ✅ don't login or navigate — user must verify email first
      setSuccess(data.message);

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordScore = (password) => {
    let score = 0;
    if (password.length >= 8)        score++;
    if (/[A-Z]/.test(password))      score++;
    if (/[a-z]/.test(password))      score++;
    if (/\d/.test(password))         score++;
    if (/[@$!%*?&]/.test(password))  score++;
    return score;
  };

  const getStrength = (password) => {
    const score = getPasswordScore(password);
    if (score <= 2) return { label: "Weak",        color: "bg-red-500",    width: "w-1/4" };
    if (score === 3) return { label: "Medium",      color: "bg-yellow-500", width: "w-2/4" };
    if (score === 4) return { label: "Strong",      color: "bg-blue-500",   width: "w-3/4" };
    if (score >= 5)  return { label: "Very Strong", color: "bg-green-600",  width: "w-full" };
  };

  const strength = getStrength(formData.password);

  // ✅ if signup succeeded, show success screen instead of the form
  if (success) {
    return (
      <div className="text-center py-6 space-y-3">
        <div style={{ fontSize: 48 }}>📧</div>
        <h3 className="text-lg font-semibold text-gray-800">Check your email!</h3>
        <p className="text-sm text-gray-600">{success}</p>
        <p className="text-xs text-gray-400">
          Didn't receive it?{" "}
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => setSuccess("")}>
            Go back and try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .pic-ring {
          width: 88px; height: 88px; border-radius: 50%;
          border: 2px dashed #c7d2fe;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; overflow: hidden; transition: border-color .2s;
          margin: 0 auto 4px;
          background: #f5f3ff;
        }
        .pic-ring:hover { border-color: #6366f1; }
        .pic-ring img { width: 100%; height: 100%; object-fit: cover; }
        .pic-hint { font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 16px; }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div className="bg-red-100 text-red-600 text-sm rounded-lg p-3 border border-red-200">
            {error}
          </div>
        )}

        {/* Profile pic */}
        <input
          ref={fileRef} type="file" accept="image/*"
          onChange={handlePicChange} style={{ display: "none" }}
        />
        <div className="pic-ring" onClick={() => fileRef.current.click()}>
          {picPreview
            ? <img src={picPreview} alt="preview" />
            : <span style={{ fontSize: 28 }}>📷</span>
          }
        </div>
        <p className="pic-hint">
          {picPreview ? "Tap to change photo" : "Tap to upload profile photo *"}
        </p>

        {/* Text fields */}
        <input
          type="text" name="name" placeholder="Full Name"
          onChange={handleChange} required
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
        />
        <input
          type="email" name="email" placeholder="Email Address"
          onChange={handleChange} required
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
        />

        <input
          type="password" name="password" placeholder="Password"
          onChange={handleChange} required
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
        />

        {/* Strength bar */}
        <div className="mt-2">
          <div className="h-2 w-full bg-gray-200 rounded">
            <div className={`h-2 rounded transition-all duration-300 ${strength?.color} ${strength?.width}`} />
          </div>
          <p className="text-xs mt-1 text-gray-600">Strength: {strength?.label || ""}</p>
        </div>

        <input
          type="password" name="confirmPassword" placeholder="Confirm Password"
          onChange={handleChange} required
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
        />

        {/* Role selector */}
        <div className="flex gap-3">
          {["student", "teacher"].map((r) => (
            <button
              key={r} type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
              className={`flex-1 py-2 rounded-lg border-2 capitalize font-medium transition ${
                formData.role === r
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-indigo-300"
              }`}
            >
              {r === "student" ? "🎓 Student" : "🏫 Instructor"}
            </button>
          ))}
        </div>

        <button
          type="submit" disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white transition ${
            isLoading
              ? "bg-gray-400"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

      </form>
    </>
  );
};

export default Signup;