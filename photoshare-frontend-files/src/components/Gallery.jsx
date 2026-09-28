import { useEffect, useState } from "react";
import api, { errMsg } from "../utils/api.js";
import { useAuth } from "../utils/AuthContext.jsx";
import PhotoForm from "./PhotoForm.jsx";

export default function Gallery() {
  const { auth, isAdmin } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () =>
    api.get("/photos")
      .then(({ data }) => setPhotos(data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await api.delete(`/photos/${id}`);
      setPhotos((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const closeForm = () => { setFormOpen(false); setEditing(null); };
  const saved = () => { closeForm(); load(); };

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button className="btn btn-primary" onClick={() => setFormOpen(true)}>+ Upload photo</button>
      </div>
      {error && <div role="alert" className="alert alert-error mb-4">{error}</div>}
      {loading ? (
        <span className="loading loading-spinner" />
      ) : photos.length === 0 ? (
        <p className="opacity-70">No photos yet — upload the first one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => {
            const canEdit = isAdmin || p.owner?._id === auth.id;
            return (
              <div key={p._id} className="card bg-base-100 shadow">
                <figure><img src={p.imageUrl} alt={p.title} className="h-56 w-full object-cover" /></figure>
                <div className="card-body p-4">
                  <h2 className="card-title">{p.title}</h2>
                  {p.description && <p className="text-sm">{p.description}</p>}
                  <p className="text-xs opacity-60">by {p.owner?.username || "unknown"}</p>
                  {canEdit && (
                    <div className="card-actions justify-end">
                      <button className="btn btn-sm" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn btn-sm btn-error btn-outline" onClick={() => remove(p._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {(formOpen || editing) && <PhotoForm photo={editing} onSaved={saved} onClose={closeForm} />}
    </div>
  );
}
