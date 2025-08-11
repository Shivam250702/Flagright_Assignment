import { Link, NavLink, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useAuthStore } from "./store/auth";

export default function App() {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <header className="border-b mb-6">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-semibold">Fullstack App</Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-600 dark:text-gray-300">A production-grade full-stack starter with auth and CRUD.</p>
    </div>
  );
}


