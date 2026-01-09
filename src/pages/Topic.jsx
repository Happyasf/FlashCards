import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteCard, readCards, readTopics } from "../firebase/firebaseBackend";
import MyFlashCard from "../components/MyFlashCard";
import AccessKeyModal from "../components/AccessKeyModal";



export default function Topic() {
  const { id } = useParams();
  const nav = useNavigate();

  const [topicName, setTopicName] = useState("Témakör");
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);

  const [hasAccess, setHasAccess] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    readTopics().then(all => {
      const t = all.find(x => x.id === id);
      if (t?.name) setTopicName(t.name);
    });


    readCards(id).then(data => {
      setCards(data);
      setIdx(0);
      console.log("CARDS:", data);
    });
  }, [id]);

  const handleAdd = () => {
    hasAccess ? nav(`/addcard/${id}`) : setOpen(true);
  };

  const prev = () => setIdx(i => (i <= 0 ? cards.length - 1 : i - 1));
  const next = () => setIdx(i => (i >= cards.length - 1 ? 0 : i + 1));

  return (
    <div className="container">
      <div className="topbar">
        <div className="pill">
          <strong>{topicName}</strong>
          <span className="badge">/topic/{id.slice(0, 6)}…</span>
        </div>

        <div className="btnRow" style={{ marginTop: 0 }}>
          <button className="btn" onClick={() => nav("/")}>Vissza</button>
          <button className="btn btnPrimary" onClick={handleAdd}>Új kártya hozzáadása</button>
        </div>
      </div>

      <div className="panel">
        {cards.length === 0 ? (
          <div className="center" style={{ minHeight: 260 }}>
            <div style={{ textAlign: "center" }}>
              <p className="sub" style={{ marginBottom: 10 }}>
                Ebben a témakörben még nincs kártya (cards subcollection üres).
              </p>
              <button className="btn btnPrimary" onClick={handleAdd}>
                Adj hozzá az első kártyát
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="center">
              <div className="bigCard">
                <MyFlashCard card={cards[idx]} />
              </div>
            </div>

            <div className="navRow">
              <button className="btn" onClick={prev}>◀</button>
              <span className="badge">
                {idx + 1} / {cards.length}
              </span>
              <button className="btn" onClick={next}>▶</button>
            </div>
          </>
        )}
      </div>

      <AccessKeyModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setHasAccess(true);
          nav(`/addcard/${id}`);
        }}
      />
      <div className="navRow">
        <button className="btn" onClick={prev}>◀</button>
        <span className="badge">
          {idx + 1} / {cards.length}
        </span>
        <button className="btn" onClick={next}>▶</button>

        <button
          className="btn"
          onClick={async () => {
            const current = cards[idx];
            const ok = confirm("Biztos törlöd ezt a kártyát?");
            if (!ok) return;

            await deleteCard(id, current.id);


            setCards((prevList) => {
              const newList = prevList.filter((c) => c.id !== current.id);

              if (newList.length === 0) {
                setIdx(0);
                return [];
              }

              if (idx >= newList.length) setIdx(newList.length - 1);
              return newList;
            });
          }}
          title="Aktuális kártya törlése"
        >
          🗑️ Kártya törlése
        </button>
      </div>

    </div>
  );
}
