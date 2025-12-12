import "./ModeSelector.css";

interface Props {
  onChoose: (mode: "text" | "choice") => void;
  onBack?: () => void;
}

export default function ModeSelector({ onChoose, onBack }: Props) {
  return (
    <div className="card mode-card">
      <h2>Elegí el modo de juego</h2>

      <div className="mode-grid">
        <button className="btn mode-btn" onClick={() => onChoose("text")}>
          ✍️ Escribir la capital
        </button>

        <button className="btn mode-btn" onClick={() => onChoose("choice")}>
          🎯 Multiple Choice (4 opciones)
        </button>
      </div>

      {onBack && (
        <button className="btn back-btn" onClick={onBack}>
          ⬅ Volver
        </button>
      )}
    </div>
  );
}
