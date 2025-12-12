interface Props {
  correct: number;
  total: number;
}

export default function Score({ correct, total }: Props) {
  return (
    <p className="score">
      Puntaje: {correct} / {total}
    </p>
  );
}
