import { useNavigate } from "react-router-dom";
import { deleteTopic } from "../firebase/firebaseBackend";

export default function TopicCard({ topic, onDeleted }) {
  const nav = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    const ok = confirm(
      `Biztos törlöd a témakört? (${topic.name})\nA benne lévő kártyák is törlődnek!`
    );
    if (!ok) return;

    await deleteTopic(topic.id);
    onDeleted?.(topic.id);
  };

  return (
    <div className="card" onClick={() => nav(`/topic/${topic.id}`)}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 className="cardTitle">{topic.name}</h3>
          <p className="cardDesc">
            {topic.description || "Kattints a kártyák megnyitásához."}
          </p>
        </div>

        <button className="btn" onClick={handleDelete} title="Témakör törlése">
          🗑️
        </button>
      </div>
    </div>
  );
}
