type DateNavigationProps = {
  dateString: string;
  isToday: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function DateNavigation({
  dateString,
  isToday,
  onPrevious,
  onNext,
  onToday,
}: DateNavigationProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onPrevious}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            cursor: "pointer",
            border: "1px solid #ddd",
            borderRadius: "20px",
            backgroundColor: "white",
          }}
        >
          Prev
        </button>

        <div>
          <div style={{ fontSize: "1.2rem" }}>{dateString}</div>
          <div style={{ color: "#667", fontSize: "0.9rem" }}>
            {isToday ? "(Today)" : ""}
          </div>
        </div>

        <button
          onClick={onNext}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            cursor: "pointer",
            border: "1px solid #ddd",
            borderRadius: "20px",
            backgroundColor: "white",
          }}
        >
          Next
        </button>
      </div>

      {!isToday && (
        <button
          onClick={onToday}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            fontSize: "0.9rem",
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#666",
            color: "white",
          }}
        >
          Back to Today
        </button>
      )}
    </div>
  );
}
