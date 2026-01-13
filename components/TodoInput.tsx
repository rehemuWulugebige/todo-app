type TodoInputProps = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
};

export default function TodoInput({ value, onChange, onAdd }: TodoInputProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        style={{
          flex: 1,
          padding: "10px",
          fontSize: "1rem",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
      <button
        onClick={onAdd}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Add
      </button>
    </div>
  );
}
