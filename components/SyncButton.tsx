import { useState } from "react";
import { Todo } from "../types";

type SyncButtonProps = {
  todos: Todo[];
};

export default function SyncButton({ todos }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos }),
      });

      const data = await response.json();

      if (response.ok) {
        setLastSync(new Date().toLocaleTimeString());
      } else {
        setError(data.error || "Sync failed");
      }
    } catch (err) {
      setError("Failed to connect");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSync}
        disabled={isSyncing || todos.length === 0}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isSyncing || todos.length === 0 ? "not-allowed" : "pointer",
          border: "1px solid #888",
          borderRadius: "20px",
          backgroundColor: "white",
          color: "black",
        }}
      >
        {isSyncing ? "Syncing..." : "Sync to Databricks"}
      </button>
      {lastSync && (
        <div style={{ color: "#666", fontSize: "0.85rem", marginTop: "8px" }}>
          ✓ Last synced: {lastSync}
        </div>
      )}
      {error && (
        <div style={{ color: "#c00", fontSize: "0.85rem", marginTop: "8px" }}>
          Error: {error}
        </div>
      )}
    </>
  );
}
