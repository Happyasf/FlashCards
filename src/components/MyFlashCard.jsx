import FlipCard from "reactjs-flip-card";

export default function MyFlashCard({ card }) {
  const boxStyle = {
    width: "100%",
    minHeight: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    fontSize: 18,
    lineHeight: 1.35,
    color: "white",
  };

  return (
    <FlipCard
      frontComponent={<div style={boxStyle}>{card.question}</div>}
      backComponent={<div style={boxStyle}>{card.answer}</div>}
    />
  );
}
