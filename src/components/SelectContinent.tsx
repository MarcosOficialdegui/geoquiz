import "./SelectContinent.css";

interface Props {
  onSelect: (continent: string) => void;
}

export default function SelectContinent({ onSelect }: Props) {
  return (
    <div className="card select-continent">
      <h2>Elegí un continente</h2>

        <button onClick={() => onSelect("World")}>Mundial 🌎</button>
      <button onClick={() => onSelect("Americas")}>América</button>
      <button onClick={() => onSelect("Europe")}>Europa</button>
      <button onClick={() => onSelect("Asia")}>Asia</button>
      <button onClick={() => onSelect("Africa")}>África</button>
      <button onClick={() => onSelect("Oceania")}>Oceanía</button>
    </div>
  );
}
