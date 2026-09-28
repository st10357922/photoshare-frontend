import { useState } from "react";
import api, { errMsg } from "../utils/api.js";

// Used for both uploading (no `photo` prop) and editing (`photo` provided)
export default function PhotoForm({ photo, onSaved, onClose }) {
  const editing = Boolean(photo);
  const [title, setTitle] = useState(photo?.title || "");
  const [description, setDescription] = useState(photo?.description || "");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !image) return setError("Please choose an image");
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    if (image) fd.append("image", image);
    try {
      const { data } = editing ? await api.put(`/photos/${photo._id}`, fd) : await api.post("/photos", fd);
      onSaved(data);
    } catch (err) {
      setError(errMsg(err));
      setSaving(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <form onSubmit={onSubmit} className="modal-box flex flex-col gap-3">
        <h3 className="font-bold text-lg">{editing ? "Edit photo" : "Upload photo"}</h3>
        {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
        <input className="input input-bordered w-full" placeholder="Title" value={title} required
          onChange={(e) => setTitle(e.target.value)} />
        <textarea className="textarea textarea-bordered w-full" placeholder="Description (optional)"
          value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
          onChange={(e) => setImage(e.target.files[0])} />
        {editing && <p className="text-xs opacity-60">Leave the file empty to keep the current image.</p>}
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </dialog>
  );
}
