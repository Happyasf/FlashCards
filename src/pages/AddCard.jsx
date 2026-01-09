import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addCard } from "../firebase/firebaseBackend";

export default function AddCard() {
  const { id } = useParams();
  const nav = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setMsg("");

    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) {
      setMsg("Töltsd ki a kérdést és a választ is.");
      return;
    }

    await addCard(id, { question: q, answer: a });

    setMsg("Mentve ✅");
    setQuestion("");
    setAnswer("");

    
    nav(`/topic/${id}`);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="h1">Új kártya hozzáadása</h1>
        <p className="sub">Add meg a kérdést és a választ, majd ments.</p>
      </div>

      <div className="panel">
        <form className="formGrid" onSubmit={save}>
          <div className="field">
            <label className="label">Kérdés</label>
            <input
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="pl. Mi a különbség a git és a GitHub között?"
            />
          </div>

          <div className="field">
            <label className="label">Válasz</label>
            <textarea
              className="textarea"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="pl. A git verziókezelő, a GitHub távoli repository szolgáltatás."
            />
          </div>

          <div className="btnRow" style={{ justifyContent: "flex-start" }}>
            <button type="button" className="btn" onClick={() => nav(-1)}>
              Vissza
            </button>
            <button type="submit" className="btn btnPrimary">
              Mentés
            </button>
            {msg && <span className="badge" style={{ alignSelf: "center" }}>{msg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
