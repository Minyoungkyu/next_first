"use client";

import { useState, useEffect, KeyboardEvent } from "react";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");

  // 서버에서 할 일 목록 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data); // 데이터 설정
    };

    fetchTodos();
  }, []);

  // 새로운 할 일 추가
  const addTodo = async () => {
    if (!task.trim()) return; // 빈 입력 방지

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });
    const newTodo = await res.json();
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTask("");
  };

  // Enter 키로 할 일 추가
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo(); // Enter 입력 시 addTodo 함수 호출
    }
  };

  // 할 일 삭제
  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // 할 일 완료 여부 업데이트
  const toggleComplete = async (id: number, task:string, completed: boolean) => {
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, task, completed: !completed }),
    });
    const updatedTodo = await res.json();

    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  // 할 일 내용 업데이트
  const updateTodo = async (id: number, updatedTask: string) => {
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, task: updatedTask }),
    });
    const updatedTodo = await res.json();

    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-300 p-2 rounded w-full"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown} // Enter 키 입력 처리
          placeholder="New task"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      <ul className="list-disc">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 flex items-center gap-2">
            {/* 완료 여부 체크박스 */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.task, todo.completed)}
            />
            {/* 할 일 내용 */}
            <input
              className={`border border-gray-300 p-2 rounded w-full ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
              type="text"
              value={todo.task}
              onChange={(e) => updateTodo(todo.id, e.target.value)}
            />
            {/* 삭제 버튼 */}
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
