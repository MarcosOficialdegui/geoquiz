import { useEffect, useState } from "react";
import Quiz from "./components/Quiz";

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <>
      <button className="dark-toggle" onClick={() => setDark(d => !d)}>
        {dark ? "☀ Modo claro" : "🌙 Modo oscuro"}
      </button>

      <Quiz />
    </>
  );
}
