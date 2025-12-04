import { useEffect, useState } from "react";
import { Todo, Category } from "../../data/Types";
import { Check } from "lucide-react";
import Dropdown from "./Dropdown";

const TodoCard = ({
  id,
  label,
  category,
  completed,
  createdAt,
  updatedAt,
}: Todo) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todolistpro-user-todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("todolistpro-user-categories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  })
  useEffect(() => {
    localStorage.setItem("todolistpro-user-todos", JSON.stringify(todos));
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTodoLabel, setEditingTodoLabel] = useState<string>(label);
  const [editingTodoCategory, setEditingTodoCategory] =
    useState<Category>(category);
  const handleSaveEdit = () => {
    const UpdatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          label: editingTodoLabel,
          category: editingTodoCategory,
        };
      }
      return todo;
    });
    setTodos(UpdatedTodos);
    setIsEditing(false);
    setEditingIndex(null);
    setEditingTodoLabel("");
    setEditingTodoCategory(category);
    
  };
  return (
    <div className="todo">
      <div className="checkbox-label">
        <div
          className="checkbox flex justify-center items-center h-5 w-5"
          style={{
            backgroundColor: completed ? category.color : "transparent",
          }}
        >
          {completed ? <Check /> : null}
        </div>
        <div className="label">
          {isEditing ? (
            <>
              <input
              type="text"
              value={editingTodoLabel}
              onChange={(e) => setEditingTodoLabel(e.target.value)}
            />
            <Dropdown
              placeholder="Select Category"
              options={categories}
              onSelect={setEditingTodoCategory}
            />
            </>
          ) : (
            <p>{label}</p>
          )}
        </div>
      </div>
      <div className="options">
        {isEditing ? (
          <button type="button" className="save" onClick={handleSaveEdit}>
            Save
          </button>
        ) : (
          <button
            type="button"
            className="edit"
            onClick={() => {
              setIsEditing(true);
              setEditingIndex(id);
              setEditingTodoLabel(label);
              setEditingTodoCategory(category);
            }}
          >
            Edit
          </button>
        )}
        <button type="button" className="delete" disabled={isEditing}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
