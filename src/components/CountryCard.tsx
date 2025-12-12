import { useState, useEffect, useRef } from "react";
import "./CountryCard.css";

interface CountryCardProps {
  country: string;
  capital: string;
  flag?: string;
  mode: "text" | "choice";
  allCountries: { country: string; capital: string }[];
  onNext: (isCorrect: boolean) => void;
}

export default function CountryCard({
  country,
  capital,
  flag,
  mode,
  allCountries,
  onNext,
}: CountryCardProps) {
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<null | "correct" | "incorrect">(null);
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalize(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // Reset cada vez que cambia el país o el modo
  useEffect(() => {
    setAnswer("");
    setStatus(null);
    setSelected(null);
    setOptions([]);

    if (mode === "text") {
      setTimeout(() => inputRef.current?.focus(), 30);
      return;
    }

    if (mode === "choice") {
      const incorrects = shuffle(
        allCountries.filter((c) => c.capital !== capital).map((c) => c.capital)
      ).slice(0, 3);

      setOptions(shuffle([capital, ...incorrects]));
    }
    // eslint-disable-next-line
  }, [country, mode]);

  // CHEQUEAR RESPUESTA
  const check = (value: string) => {
    if (status !== null) return;

    const isCorrect = normalize(value) === normalize(capital);
    setSelected(value);

    if (isCorrect) {
      setStatus("correct");
      setTimeout(() => onNext(true), 600);
    } else {
      setStatus("incorrect");
      onNext(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (status !== null) return;
    check(answer);
  };

  return (
    <div className="card fade-in">
      {flag && <img src={flag} alt={`${country} flag`} className="flag" />}

      <h2 className="question">
        ¿Cuál es la capital de <strong>{country}</strong>?
      </h2>

      {/* MODO TEXTO */}
      {mode === "text" && (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="input"
            placeholder="Escribí la capital"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={status === "correct"}
            autoComplete="off"
          />

          <button className="btn" type="submit" disabled={status === "correct"}>
            Enviar
          </button>
        </form>
      )}

      {/* MODO MULTIPLE CHOICE */}
      {mode === "choice" && (
        <div className="options-grid" role="list">
          {options.map((opt) => {
  const isCorrect = opt === capital;     // ← cambio clave
  const isSelected = selected === opt;

  let classes = "option-btn";

  if (status === null) {
    // sin respuesta → todas iguales
  } else {
    if (isCorrect) classes += " correct";        // solo UNA verde
    else if (isSelected) classes += " wrong";    // la elegida incorrecta
    else classes += " disabled";                 // el resto gris
  }


            return (
              <button
 key={opt}
      className={classes}
      onClick={() => check(opt)}
      disabled={status !== null}
      aria-pressed={isSelected}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {status === "correct" && (
        <p className="feedback correct">✔️ ¡Correcto!</p>
      )}

      {status === "incorrect" && (
        <p className="feedback incorrect">
          ❌ Incorrecto — la capital correcta es <strong>{capital}</strong>
        </p>
      )}
    </div>
  );
}
