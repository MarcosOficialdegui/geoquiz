import { useState, useEffect, useRef } from "react";
import "./CountryCard.css";

interface CountryCardProps {
  country: string;
  capital: string;
  flag: string;
  onNext: (isCorrect: boolean) => void;
}

export default function CountryCard({
  country,
  capital,
  flag,
  onNext,
}: CountryCardProps) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<null | "correct" | "incorrect">(null);
  const [animate, setAnimate] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function normalize(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  useEffect(() => {
    setAnswer("");
    setStatus(null);

    // activar animación de entrada
    setAnimate(true);
    setTimeout(() => setAnimate(false), 600);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
  }, [country]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (status !== null) return;

    const userNorm = normalize(answer);
    const realNorm = normalize(capital);

    if (userNorm === realNorm) {
      setStatus("correct");

      setTimeout(() => {
        onNext(true);
      }, 650);
      return;
    }

    setStatus("incorrect");
    onNext(false);
  };

  return (
    <div className={`card animated ${animate ? "fade-in" : ""} ${status === "incorrect" ? "shake" : ""}`}>
      <img src={flag} alt={`${country} flag`} className="flag" />

      <h2 className="question">
        ¿Cuál es la capital de <strong>{country}</strong>?
      </h2>

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

        <button className="btn primary" type="submit" disabled={status === "correct"}>
          Enviar
        </button>
      </form>

      {status === "correct" && (
        <p className="feedback correct fade-text">
          ✔️ ¡Correcto!
        </p>
      )}

      {status === "incorrect" && (
        <p className="feedback incorrect fade-text">
          ❌ Incorrecto — la capital correcta es <strong>{capital}</strong>
        </p>
      )}
    </div>
  );
}
