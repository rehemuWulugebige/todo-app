"use client";

import { useState, useEffect } from "react";
import { Todo } from "../types";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import DateNavigation from "../components/DateNavigation";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import Summary from "../components/Summary";
import SyncButton from "../components/SyncButton";
import ExportButton from "../components/ExportButton";

export default function Home() {
  // the state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // loading our todo from the database but only once
  useEffect(() => {
    const loadTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading todos:", error);
      } else {
        // convert supabase data to our todo format
        const formattedTodos: Todo[] = data.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          completed: item.completed,
          date: item.date,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        setTodos(formattedTodos);
      }

      setSelectedDate(new Date().toISOString().split("T")[0]);
      setIsLoaded(true);
    };

    loadTodos();
  }, []);

  // date calculation
  const todayISO = new Date().toISOString().split("T")[0];

  const selectedDateObj = new Date(selectedDate + "T00:00:00");
  const dateString = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isToday = selectedDate === todayISO;

  // this is our handlers
  const handleAddTodo = async () => {
    if (inputValue.trim() === "") return;

    const newTodo = {
      title: inputValue.trim(),
      completed: false,
      date: selectedDate,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert([newTodo])
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      const formattedTodo: Todo = {
        id: String(data.id),
        title: data.title,
        completed: data.completed,
        date: data.date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setTodos([...todos, formattedTodo]);
      setInputValue("");
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({
        completed: !todo.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error toggling todo:", error);
    } else {
      setTodos(
        todos.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      setTodos(todos.filter((t) => t.id !== id));
    }
  };

  const goToPreviousDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const goToNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  // filtered data
  const filteredTodos = todos.filter((todo) => todo.date === selectedDate);
  const completedCount = filteredTodos.filter((todo) => todo.completed).length;

  // render
  if (!isLoaded) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Header title="My Todo App" />

      <DateNavigation
        dateString={dateString}
        isToday={isToday}
        onPrevious={goToPreviousDay}
        onNext={goToNextDay}
        onToday={goToToday}
      />

      <TodoInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={handleAddTodo}
      />

      <TodoList
        todos={filteredTodos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />

      <Summary total={filteredTodos.length} completed={completedCount} />

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ExportButton todos={todos} />
        <SyncButton todos={todos} />{" "}
      </div>
    </div>
  );
}
