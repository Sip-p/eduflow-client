import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
const VerifyEmail = () => {
  const { token }       = useParams();
   const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState("verifying");
 const navigate = useNavigate();
  useEffect(() => {
    const verify = async () => {
      const result = await verifyEmail(token); // ✅ store action
      if (result.success) {
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0c10" }}>
      <div style={{ textAlign: "center", color: "#e4e0d8", fontFamily: "sans-serif", fontSize: 16, lineHeight: 2 }}>
        {status === "verifying" && <p>⏳ Verifying your email...</p>}
        {status === "success"   && <p>✅ Email verified! Redirecting to login in 3 seconds...</p>}
        {status === "error"     && <p>❌ Invalid or expired link. Please sign up again.</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;