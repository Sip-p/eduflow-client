import React, { useState } from 'react'

const Settings = () => {
  // Example state (replace with actual user data from context or props)
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")
  const [password, setPassword] = useState("")
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })
  const [language, setLanguage] = useState("English")
  const [region, setRegion] = useState("India")
  const [twoFactor, setTwoFactor] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // TODO: Send updated settings to backend
    alert("Settings saved!")
  }

  const handleDeleteAccount = () => {
    // TODO: Connect to backend for account deletion
    if(window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deleted!")
    }
  }

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
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="email"
              className="border p-2 rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
            placeholder="New Password"
          />
        </div>
        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Notification Settings</h2>
          <div className="flex gap-6">
            <label>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))}
              /> Email
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={e => setNotifications(n => ({ ...n, sms: e.target.checked }))}
              /> SMS
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={e => setNotifications(n => ({ ...n, push: e.target.checked }))}
              /> Push
            </label>
          </div>
        </div>
        {/* Language and Region */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Language & Region</h2>
          <div className="flex gap-4">
            <select
              className="border p-2 rounded"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
            <select
              className="border p-2 rounded"
              value={region}
              onChange={e => setRegion(e.target.value)}
            >
              <option>India</option>
              <option>USA</option>
              <option>Europe</option>
            </select>
          </div>
        </div>
        {/* Security */}
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Security Settings</h2>
          <label>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={e => setTwoFactor(e.target.checked)}
            /> Enable Two-Factor Authentication
          </label>
        </div>
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
  )
}

export default Settings