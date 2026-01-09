import { useEffect, useState } from "react";
import TopicCard from "../components/TopicCard";
import { readTopics, addTopic } from "../firebase/firebaseBackend";
import AccessKeyModal from "../components/AccessKeyModal";


export default function Home() {
  const [topics, setTopics] = useState([]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [openKey, setOpenKey] = useState(false);

  const load = async () => {
    const data = await readTopics();
    setTopics(data);
  };

  useEffect(() => {
    load();
  }, []);

  const doAdd = async () => {
    setMsg("");

    const clean = name.trim();
    if (!clean) {
      setMsg("Adj meg egy témanevet!");
      return;
    }

    const ok = await addTopic(clean, desc.trim());

    if (!ok) {
      setMsg("⚠️ Ez a témakör már létezik (vagy hiba történt).");
      return;
    }

    setName("");
    setDesc("");
    setMsg("✅ Témakör hozzáadva");
    await load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (hasAccess) {
      await doAdd();
    } else {
      setOpenKey(true);
    }
  };


  return (
    <div className="container">
      <div className="header">
        <h1 className="h1">OSZTV verseny témakörök</h1>
        <p className="sub">Szoftverfejlesztő és tesztelő szakma – válassz témakört</p>
      </div>


      <div className="panel">
        <form onSubmit={handleAdd} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label className="badge">Új témakör neve</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="pl. GIT / Java / SQL"
              style={{
                padding: "12px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.14)",
                background: "rgba(255,255,255,.06)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label className="badge">Leírás (opcionális)</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="pl. Verziókezelés alapjai"
              style={{
                padding: "12px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.14)",
                background: "rgba(255,255,255,.06)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div className="btnRow" style={{ justifyContent: "flex-start" }}>
            <button className="btn btnPrimary" type="submit">
              + Témakör hozzáadása
            </button>
            {msg && <span className="badge" style={{ alignSelf: "center" }}>{msg}</span>}
          </div>
        </form>
      </div>


      {topics.length === 0 ? (
        <p className="sub" style={{ textAlign: "center", marginTop: 18 }}>
          Még nincs témakör. Adj hozzá fent egyet.
        </p>
      ) : (
        <div className="grid">
          {topics.map((t) => (
            <TopicCard
              key={t.id}
              topic={t}
              onDeleted={() => setTopics((prev) => prev.filter((x) => x.id !== t.id))}
            />
          ))}
        </div>
      )}
      <AccessKeyModal
        open={openKey}
        onClose={() => setOpenKey(false)}
        onSuccess={async () => {
          setHasAccess(true);
          setOpenKey(false);
          await doAdd();
        }}
      />

    </div>
  );
}
