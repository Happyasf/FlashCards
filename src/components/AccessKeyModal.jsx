import { useEffect, useState } from "react";
import { Modal } from "@mui/material";

const SECRET = "osztv123";

export default function AccessKeyModal({ open, onClose, onSuccess }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setKey("");
      setErr("");
    }
  }, [open]);

  const checkKey = () => {
    if (key.trim() === SECRET) {
      onSuccess();
    } else {
      setErr("Hibás kulcs.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="center"
        style={{ minHeight: "100vh", padding: 18 }}
      >
        <div className="modalBox">
          <h3 className="modalTitle">Titkos kulcs szükséges</h3>
          <p className="modalSub">Add meg a kulcsot a művelet folytatásához.</p>

          <div className="field">
            <label className="label">Kulcs</label>
            <input
              className="input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="írd be a kulcsot…"
              onKeyDown={(e) => e.key === "Enter" && checkKey()}
            />
            {err && <div className="badge" style={{ color: "#ffd1d1" }}>{err}</div>}
          </div>

          <div className="btnRow" style={{ justifyContent: "flex-end" }}>
            <button className="btn" onClick={onClose}>Mégse</button>
            <button className="btn btnPrimary" onClick={checkKey}>Belépés</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
