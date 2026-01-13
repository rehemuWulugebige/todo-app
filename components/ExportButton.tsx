import { Todo } from "../types";

type ExportButtonProps = {
  todos: Todo[];
};

export default function ExportButton({ todos }: ExportButtonProps) {
  const handleExport = () => {
    if (todos.length === 0) {
      alert("No todos to export");
      return;
    }

    // create teh csv content
    const csvHeader = "id,title,completed,date,created_at,updated_at";
    const csvRows = todos.map(
      (todo) =>
        `${todo.id},"${todo.title}",${todo.completed},${todo.date},${todo.createdAt},${todo.updatedAt}`
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");

    // download the file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todos_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={todos.length === 0}
      style={{
        padding: "10px 20px",
        fontSize: "1rem",
        height: "45px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: todos.length === 0 ? "not-allowed" : "pointer",
        border: "1px solid #888",
        borderRadius: "20px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      Export CSV
    </button>
  );
}
