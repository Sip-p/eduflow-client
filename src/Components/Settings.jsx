import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("India");
  const [twoFactor, setTwoFactor] = useState(false);

  // ✅ Password change (called manually on Save)
  const handlePasswordChange = async () => {
    if (!password) return alert("Enter a new password first");
    try {
   const response = await axios.post(
  `${backendUrl}/api/auth/reset-setting-password`,
  { password },
  {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ correct
      "Content-Type": "application/json",
    },
  }
);

      alert(response.data.message || "Password reset successful!");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Error changing password");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Call password change here (you could also update name/email similarly)
   
    alert("Settings saved!");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`${backendUrl}/api/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          alert("Account deleted");
          localStorage.clear();
          navigate("/");
        }
      } catch {
        alert("Error deleting account");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 my-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Account Settings */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Account Settings</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              className="border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="email"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Change Password</h2>
          <input
            type="password"
            className="border p-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          <button className='bg-blue-600 rounded-lg p-3 mt-5' onClick={()=>{handlePasswordChange()}}>Submit</button>
        </div>

        {/* Other Settings... */}
        {/* Notification, Language, Security */}
        {/* (Keep same as your current layout) */}

        {/* Delete Account */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Account</h2>
          <p className="text-gray-700 mb-2">Permanently delete your account and all associated data.</p>
          <button
            type="button"
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>

        {/* Save/Cancel */}
        <div className="flex gap-4 justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-300 text-black px-6 py-2 rounded-full hover:bg-gray-400 transition"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
