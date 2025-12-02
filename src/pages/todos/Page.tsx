import { useState } from "react";
import { Todo } from "../../data/Types";
import AddTodo from "../../components/common/AddTodo";

const Todos = () => {
  const LOCALSTORAGE_KEY = "todolistpro-user-todos";
  const [todos, setTodos] = useState<Todo[]>(() => {
    const SavedTodos = localStorage.getItem(LOCALSTORAGE_KEY);
    return (SavedTodos) ? JSON.parse(SavedTodos) : [];
  });
  const [error, setError] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  return (
    <main className="landing-page">
      <AddTodo />
    </main>
  );
};

export default Todos;
