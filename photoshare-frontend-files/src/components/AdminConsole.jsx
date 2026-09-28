import { useEffect, useState } from "react";
import api, { errMsg } from "../utils/api.js";
import { useAuth } from "../utils/AuthContext.jsx";

export default function AdminConsole() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api.get("/users").then(({ data }) => setUsers(data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const act = async (fn) => {
    setError("");
    try { await fn(); await load(); } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">Admin console</h1>
      {error && <div role="alert" className="alert alert-error mb-4">{error}</div>}
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr><th>Username</th><th>Email</th><th>Role</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const self = u._id === auth.id;
              return (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === "admin" ? "badge-primary" : "badge-ghost"}`}>{u.role}</span></td>
                  <td className="text-right space-x-2">
                    {u.role === "user" ? (
                      <button className="btn btn-xs" onClick={() => act(() => api.put(`/users/${u._id}/promote`))}>Promote</button>
                    ) : (
                      <button className="btn btn-xs" disabled={self} onClick={() => act(() => api.put(`/users/${u._id}/demote`))}>Demote</button>
                    )}
                    <button className="btn btn-xs btn-error btn-outline" disabled={self}
                      onClick={() => confirm(`Delete ${u.username}?`) && act(() => api.delete(`/users/${u._id}`))}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
