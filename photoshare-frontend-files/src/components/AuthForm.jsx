import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import api, { errMsg } from "../utils/api.js";
import { useAuth } from "../utils/AuthContext.jsx";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (auth) return <Navigate to="/" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = isSignup ? form : { email: form.email, password: form.password };
      const { data } = await api.post(`/auth/${mode}`, body);
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow max-w-md mx-auto mt-10">
      <div className="card-body gap-3">
        <h2 className="card-title">{isSignup ? "Create an account" : "Welcome back"}</h2>
        {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
        {isSignup && (
          <input name="username" placeholder="Username" className="input input-bordered w-full"
            value={form.username} onChange={onChange} required minLength={3} />
        )}
        <input name="email" type="email" placeholder="Email" className="input input-bordered w-full"
          value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password (min 6 chars)"
          className="input input-bordered w-full" value={form.password} onChange={onChange}
          required minLength={6} />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
        </button>
        <p className="text-sm">
          {isSignup ? "Already have an account? " : "No account yet? "}
          <Link className="link link-primary" to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </div>
    </form>
  );
}
