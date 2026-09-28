import { useEffect, useState } from "react";
import api, { errMsg } from "../utils/api.js";

export default function Profile() {
  const [form, setForm] = useState({ username: "", email: "" });
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState(null); // { type, text }

  useEffect(() => {
    api.get("/users/me")
      .then(({ data }) => { setForm({ username: data.username, email: data.email }); setRole(data.role); })
      .catch((e) => setMsg({ type: "error", text: errMsg(e) }));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const { data } = await api.put("/users/me", form);
      setForm({ username: data.username, email: data.email });
      setMsg({ type: "success", text: "Profile updated" });
    } catch (err) {
      setMsg({ type: "error", text: errMsg(err) });
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow max-w-md mx-auto mt-10">
      <div className="card-body gap-3">
        <h2 className="card-title">My profile <span className="badge badge-outline">{role}</span></h2>
        {msg && <div role="alert" className={`alert alert-${msg.type} text-sm`}>{msg.text}</div>}
        <label className="form-control">
          <span className="label-text">Username</span>
          <input className="input input-bordered w-full" value={form.username} required minLength={3}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </label>
        <label className="form-control">
          <span className="label-text">Email</span>
          <input type="email" className="input input-bordered w-full" value={form.email} required
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <button className="btn btn-primary">Save changes</button>
      </div>
    </form>
  );
}
