import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { Todo, Category } from "../../data/Types";

const AddTodo = () => {
  const LOCALSTORAGE_KEY = "todolistpro-user-todos";
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: "",
    label: "",
    color: ""
  });
  const [todo, setTodo] = useState<Todo>({
    id: "",
    label: "",
    category: selectedCategory,
    completed: false,
    createdAt: "",
    updatedAt: ""
  });
  const [todos, setTodos] = useState<Todo[]>(() => {
    const SavedTodos = localStorage.getItem(LOCALSTORAGE_KEY);
    return (SavedTodos) ? JSON.parse(SavedTodos) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem("todolistpro-user-categories");
    return (SavedCategories) ? JSON.parse(SavedCategories) : [];
  });
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(todos));
  }, [todos]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTodo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // removing all categories from the localstorage
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(todo);
    e.preventDefault();
    setTodos(prev => [...prev, todo]);
    setSelectedCategory({
      id: "",
      label: "",
      color: ""
    })
    setTodo({
      id: "",
      label: "",
      category: selectedCategory,
      completed: false,
      createdAt: "",
      updatedAt: ""
    });
  };
  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="input-field">
        <input
          type="text"
          placeholder="Todo"
          name="label"
          value={todo.label}
          onChange={handleChange}
        />
      </div>
      <div className="input-field">
        <Dropdown
        placeholder="Category"
        options={[
          { id: "", label: "General", color: "#ff0000ff"},
          { id: "", label: "Professional", color: "#00ff00"},
          { id: "", label: "Personal", color: "#0000ff"},
        ]}
        onSelect={(option) => setSelectedCategory(option)}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  )
}

export default AddTodo;