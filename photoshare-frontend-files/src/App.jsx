import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./utils/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import AuthForm from "./components/AuthForm.jsx";
import Gallery from "./components/Gallery.jsx";
import Profile from "./components/Profile.jsx";
import AdminConsole from "./components/AdminConsole.jsx";

function Protected({ children, admin }) {
  const { auth, isAdmin } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/signup" element={<AuthForm mode="signup" />} />
          <Route path="/" element={<Protected><Gallery /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/admin" element={<Protected admin><AdminConsole /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
