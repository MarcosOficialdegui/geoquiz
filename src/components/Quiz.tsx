import { useState, useEffect } from "react";
import CountryCard from "./CountryCard";
import ModeSelector from "./ModeSelector";
import SelectContinent from "./SelectContinent";
import { countries } from "../data/countries";
import "./Quiz.css";

export default function Quiz() {
  const [mode, setMode] = useState<"text" | "choice" | null>(null);
  const [continent, setContinent] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mustClickNext, setMustClickNext] = useState(false);

  function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    if (!mode || !continent) return;
    const base =
      continent === "World"
        ? countries
        : countries.filter((c) => c.continent === continent);
    setFiltered(shuffle(base));
    setIndex(0);
    setCorrect(0);
    setMustClickNext(false);
  }, [mode, continent]);

  useEffect(() => {
    if (!mustClickNext) return;
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") goNext();
    };
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [mustClickNext]);

  // primer paso: elegir modo
  if (!mode) {
    return <ModeSelector onChoose={(m) => setMode(m)} onBack={() => setMode(null)} />;
  }

  // segundo paso: elegir continente
  if (!continent) {
    return <SelectContinent onSelect={(c) => setContinent(c)} />;
  }

  // si ya no hay más países
  if (index >= filtered.length) {
    return (
      <div className="card">
        <button className="btn back-btn" onClick={() => setContinent(null)}>
          ⬅ Volver al continente
        </button>

        <h2>Juego terminado</h2>
        <p className="score">Puntaje: {correct} / {filtered.length}</p>

        <button className="btn" onClick={() => { setMode(null); setContinent(null); }}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const current = filtered[index];

  const handleResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setMustClickNext(false);
      setIndex((i) => i + 1);
    } else {
      setMustClickNext(true);
    }
  };

  const goNext = () => {
    setMustClickNext(false);
    setIndex((i) => i + 1);
  };

  return (
    <>
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 560 }}>
        <button className="btn back-btn" onClick={() => setMode(null)}>⬅ Volver</button>
        <p className="score">Puntaje: {correct} / {index}</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(index / filtered.length) * 100}%` }} />
      </div>

      <CountryCard
        key={index} // fuerza remount limpio
        country={current.country}
        capital={current.capital}
        flag={current.flag}
        mode={mode}
        allCountries={filtered}
        onNext={handleResult}
      />

      {mustClickNext && (
        <button className="btn next-btn" onClick={goNext}>Siguiente</button>
      )}
    </>
  );
}
