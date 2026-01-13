type SummaryProps = {
  total: number;
  completed: number;
};

export default function Summary({ total, completed }: SummaryProps) {
  return (
    <div style={{ marginTop: "20px", color: "#666", textAlign: "center" }}>
      {total} todos · {completed} completed
    </div>
  );
}
