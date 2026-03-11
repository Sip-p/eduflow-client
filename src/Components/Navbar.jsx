import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { socket } from "../socket";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const role = user?.role;

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    addNotification,
    markRead,
    markAllRead,
  } = useNotificationStore();

  const [menuOpen,          setMenuOpen]          = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // ── Fetch existing notifications from DB on mount ─────────────────────────
  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // ── Listen for live socket notifications ──────────────────────────────────
  useEffect(() => {
    if (!user) return;

    // ✅ named function so we can remove exactly this listener on cleanup
    const handleNotification = (notif) => {
      addNotification(notif);
    };

    socket.on("notification", handleNotification);

    return () => {
      // ✅ pass the same function reference — only removes THIS handler
      // socket.off("notification") without a ref would remove ALL listeners
      socket.off("notification", handleNotification);
    };
  }, [user]);

  // ── Close dropdown when clicking outside ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Role-based notification filter ────────────────────────────────────────
  // Student sees: "Course Published"
  // Instructor sees: "Student Enrolled"
  const visibleNotifications = notifications.filter((n) => {
    if (role === "student") return n.type === "Course Published";
    if (role === "teacher") return n.type === "Student Enrolled";
    return true;
  });

  const visibleUnread = visibleNotifications.filter((n) => !n.read).length;

  // ── Nav links ─────────────────────────────────────────────────────────────
  const navLinks = [
    { label: "Home",      path: "/",                                                        always: true },
    { label: "Dashboard", path: role === "teacher" ? "/instructor-dashboard" : "/student-dashboard", roles: ["teacher", "student"] },
    { label: "Courses",   path: "/courses",   roles: ["student"] },
    { label: "Quizzes",   path: "/quiz",      roles: ["student"] },
    { label: "About",     path: "/about",     always: true },
    { label: "Pricing",   path: "/pricing",   always: true },
    { label: "Reviews",   path: "/review",    always: true },
  ].filter((l) => l.always || l.roles?.includes(role));

  const handleAuthClick = () => {
    if (user) { logout(); navigate("/"); }
    else navigate("/login");
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) markRead(notif._id);

    // instructor → view the enrolled student's profile
    if (role === "teacher" && notif.data?.studentId) {
      navigate(`/profile/${notif.data.studentId}`);
    }
    // student → view the published course
    if (role === "student" && notif.data?.courseId) {
      navigate(`/courses/${notif.data.courseId}`);
    }

    setShowNotifications(false);
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return `${diff}s ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --nb-bg:      #0c0c10;
          --nb-surf:    #111116;
          --nb-surf2:   #18181f;
          --nb-border:  #25252f;
          --nb-border2: #2e2e3a;
          --nb-text:    #e4e0d8;
          --nb-text2:   #9490a0;
          --nb-muted:   #4a4858;
          --nb-amber:   #e8a87c;
          --nb-red:     #e07070;
          --nb-green:   #6db88a;
          --nb-sans:    'Outfit', sans-serif;
        }

        .nb-root {
          background: var(--nb-bg);
          border-bottom: 1px solid var(--nb-border);
          position: sticky;
          top: 0;
          z-index: 200;
          font-family: var(--nb-sans);
        }

        .nb-inner {
          max-width: 1280px;
          margin: auto;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }

        /* BRAND */
        .nb-brand {
          font-weight: 700;
          font-size: 17px;
          color: var(--nb-text);
          cursor: pointer;
          letter-spacing: -0.02em;
        }
        .nb-brand em { color: var(--nb-amber); font-style: normal; }

        /* LINKS */
        .nb-links { display: flex; gap: 2px; list-style: none; }
        .nb-link {
          background: none;
          border: none;
          color: var(--nb-text2);
          font-size: 13px;
          font-family: var(--nb-sans);
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .nb-link:hover { color: var(--nb-text); background: var(--nb-surf2); }

        /* RIGHT */
        .nb-right { display: flex; align-items: center; gap: 12px; }

        /* BELL */
        .nb-bell-wrap { position: relative; }
        .nb-bell {
          position: relative;
          background: none;
          border: 1px solid var(--nb-border2);
          color: var(--nb-text2);
          cursor: pointer;
          padding: 7px 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .nb-bell:hover { background: var(--nb-surf2); color: var(--nb-text); border-color: var(--nb-muted); }
        .nb-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--nb-red);
          color: white;
          font-size: 9px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--nb-bg);
        }

        /* NOTIFICATION DROPDOWN */
        .nb-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 320px;
          background: var(--nb-surf);
          border: 1px solid var(--nb-border);
          border-radius: 10px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
          overflow: hidden;
          z-index: 300;
        }

        .nb-drop-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--nb-border);
        }
        .nb-drop-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--nb-text2);
        }
        .nb-mark-all {
          background: none;
          border: none;
          font-family: var(--nb-sans);
          font-size: 11px;
          color: var(--nb-amber);
          cursor: pointer;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          transition: background 0.12s;
        }
        .nb-mark-all:hover { background: rgba(232,168,124,0.1); }

        .nb-notif-list { max-height: 340px; overflow-y: auto; }
        .nb-notif-list::-webkit-scrollbar { width: 3px; }
        .nb-notif-list::-webkit-scrollbar-thumb { background: var(--nb-border2); }

        .nb-notif-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 12px 16px;
          border-bottom: 1px solid var(--nb-border);
          cursor: pointer;
          transition: background 0.12s;
          position: relative;
        }
        .nb-notif-item:hover { background: var(--nb-surf2); }
        .nb-notif-item:last-child { border-bottom: none; }
        .nb-notif-unread { background: rgba(232,168,124,0.04); }

        .nb-notif-dot {
          width: 7px;
          height: 7px;
          min-width: 7px;
          border-radius: 50%;
          background: var(--nb-amber);
          margin-top: 5px;
          flex-shrink: 0;
        }
        .nb-notif-dot-read { background: transparent; }

        .nb-notif-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          background: var(--nb-surf2);
          flex-shrink: 0;
        }

        .nb-notif-body { flex: 1; min-width: 0; }
        .nb-notif-msg {
          font-size: 12.5px;
          color: var(--nb-text);
          line-height: 1.45;
          font-weight: 400;
        }
        .nb-notif-msg strong { font-weight: 600; color: var(--nb-amber); }
        .nb-notif-time {
          font-size: 10px;
          color: var(--nb-muted);
          margin-top: 3px;
        }

        .nb-drop-empty {
          padding: 32px 16px;
          text-align: center;
          color: var(--nb-muted);
          font-size: 13px;
        }

        /* AVATAR */
        .nb-avatar { display: flex; align-items: center; gap: 8px; }
        .nb-avatar-img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--nb-border2);
        }
        .nb-username {
          font-size: 13px;
          font-weight: 500;
          color: var(--nb-text2);
        }

        .nb-logout {
          border: 1px solid var(--nb-border2);
          background: none;
          color: var(--nb-text2);
          font-size: 12px;
          font-family: var(--nb-sans);
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nb-logout:hover { border-color: var(--nb-red); color: var(--nb-red); }

        .nb-cta {
          background: var(--nb-amber);
          color: #1a0e06;
          border: none;
          padding: 7px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-family: var(--nb-sans);
          font-size: 13px;
          font-weight: 600;
          transition: opacity 0.15s;
        }
        .nb-cta:hover { opacity: 0.88; }

        /* HAMBURGER */
        .nb-hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .nb-hamburger span { width: 20px; height: 2px; background: var(--nb-text2); border-radius: 2px; }

        .nb-mobile {
          display: none;
          flex-direction: column;
          background: var(--nb-bg);
          border-top: 1px solid var(--nb-border);
          padding: 8px 0;
        }
        .nb-mobile.open { display: flex; }
        .nb-mobile button {
          padding: 11px 20px;
          background: none;
          border: none;
          color: var(--nb-text2);
          font-family: var(--nb-sans);
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: background 0.12s;
        }
        .nb-mobile button:hover { background: var(--nb-surf2); color: var(--nb-text); }

        @media (max-width: 768px) {
          .nb-links    { display: none; }
          .nb-right    { display: none; }
          .nb-hamburger { display: flex; }
        }
      `}</style>

      <nav className="nb-root">
        <div className="nb-inner">

          {/* Brand */}
          <div className="nb-brand" onClick={() => navigate("/")}>
            Edu<em>Flow</em>
          </div>

          {/* Desktop links */}
          <ul className="nb-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button className="nb-link" onClick={() => navigate(link.path)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          {user ? (
            <div className="nb-right">

              {/* ── NOTIFICATION BELL ── */}
              <div className="nb-bell-wrap" ref={dropdownRef}>
                <button
                  className="nb-bell"
                  onClick={() => setShowNotifications((p) => !p)}>
                  <Bell size={16} />
                  {visibleUnread > 0 && (
                    <span className="nb-badge">
                      {visibleUnread > 9 ? "9+" : visibleUnread}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="nb-dropdown">
                    <div className="nb-drop-header">
                      <span className="nb-drop-title">Notifications</span>
                      {visibleUnread > 0 && (
                        <button className="nb-mark-all" onClick={markAllRead}>
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="nb-notif-list">
                      {visibleNotifications.length === 0 ? (
                        <div className="nb-drop-empty">No notifications yet</div>
                      ) : (
                        visibleNotifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`nb-notif-item ${!notif.read ? "nb-notif-unread" : ""}`}
                            onClick={() => handleNotifClick(notif)}>

                            {/* unread dot */}
                            <div className={`nb-notif-dot ${notif.read ? "nb-notif-dot-read" : ""}`} />

                            {/* icon based on notification type */}
                            <div className="nb-notif-icon">
                              {notif.type === "Course Published"    && "📚"}
                              {notif.type === "Student Enrolled"    && "🎓"}
                              {notif.type === "Assignment Deadline" && "📝"}
                              {notif.type === "New Announcement"    && "📢"}
                              {notif.type === "Course Update"       && "🔄"}
                            </div>

                            <div className="nb-notif-body">
                              <div className="nb-notif-msg">{notif.message}</div>
                              <div className="nb-notif-time">{timeAgo(notif.createdAt)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar + name + logout */}
              <div className="nb-avatar">
                <img
                  src={user.pic || "https://via.placeholder.com/30"}
                  alt={user.name}
                  className="nb-avatar-img"
                />
                <span className="nb-username">{user.name?.split(" ")[0]}</span>
                <button className="nb-logout" onClick={handleAuthClick}>Logout</button>
              </div>

            </div>
          ) : (
            <button className="nb-cta" onClick={handleAuthClick}>Sign In</button>
          )}

          {/* Hamburger */}
          <button className="nb-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`nb-mobile ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}>
              {link.label}
            </button>
          ))}
          <button onClick={() => { handleAuthClick(); setMenuOpen(false); }}>
            {user ? "Logout" : "Sign In"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;