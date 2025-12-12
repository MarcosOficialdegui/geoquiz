import { useState, useEffect } from "react";
import CountryCard from "./CountryCard";
import SelectContinent from "./SelectContinent";
import { countries } from "../data/countries";
import "./Quiz.css";

export default function Quiz() {
  const [continent, setContinent] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mustClickNext, setMustClickNext] = useState(false);

  // ☆ Mezclar países
  function shuffle(arr: any[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ☆ Cuando elige continente, mezclamos y reiniciamos
  useEffect(() => {
    if (!continent) return;

    const base =
      continent === "World"
        ? countries
        : countries.filter((c) => c.continent === continent);

    setFiltered(shuffle(base));
    setIndex(0);
    setCorrect(0);
    setMustClickNext(false);
  }, [continent]);

  // ☆ Permitir “Enter” para avanzar después de fallar
  useEffect(() => {
    if (!mustClickNext) return;

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") goNext();
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [mustClickNext]);

  // ☆ Si aún no eligió continente → mostrar menú
  if (!continent) {
    return <SelectContinent onSelect={(c) => setContinent(c)} />;
  }

  // ☆ Juego terminado
  if (index >= filtered.length) {
    return (
      <div className="card">

        <button className="btn back-btn" onClick={() => setContinent(null)}>
          ⬅ Volver al menú
        </button>

        <h2>Juego terminado</h2>
        <p className="score">
          Puntaje: {correct} / {filtered.length}
        </p>

        <button className="btn" onClick={() => window.location.reload()}>
          Reiniciar
        </button>
      </div>
    );
  }

  const current = filtered[index];

  // ☆ Lógica: solo avanza automático si acierta
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
      {/* ☆ BOTÓN PARA VOLVER AL MENÚ DURANTE EL JUEGO */}
      <button className="btn back-btn" onClick={() => setContinent(null)}>
        ⬅ Volver al menú
      </button>

      <p className="score">Puntaje: {correct} / {index}</p>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${(index / filtered.length) * 100}%` }}
        />
      </div>

      <CountryCard
        country={current.country}
        capital={current.capital}
        flag={current.flag}
        onNext={handleResult}
      />

      {mustClickNext && (
        <button className="btn next-btn" onClick={goNext}>
          Siguiente
        </button>
      )}
    </>
  );
}
