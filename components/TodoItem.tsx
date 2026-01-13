import { Todo } from "../types";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <span
        onClick={() => onToggle(todo.id)}
        style={{
          marginRight: "10px",
          cursor: "pointer",
          fontSize: "1.2rem",
        }}
      >
        {todo.completed ? "☑" : "☐"}
      </span>
      <span
        style={{
          flex: 1,
          textDecoration: todo.completed ? "line-through" : "none",
          color: todo.completed ? "#999" : "#000",
        }}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: "none",
          border: "none",
          color: "#555",
          cursor: "pointer",
          fontSize: "1.2rem",
        }}
      >
        ×
      </button>
    </li>
  );
}
