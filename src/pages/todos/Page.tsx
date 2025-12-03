import { useState, useEffect } from "react";
import { Todo, Category } from "../../data/Types";
import Wrapper from "../../components/common/Wrapper";
import Dropdown from "../../components/common/Dropdown";
import { NavLink } from "react-router-dom";

const Todos = () => {
  const LOCALSTORAGE_TODOS_KEY = "todolistpro-user-todos";
  const LOCALSTORAGE_CATEGORIES_KEY = "todolistpro-user-todos";
  const [todos, setTodos] = useState<Todo[]>(() => {
    const SavedTodos = localStorage.getItem(LOCALSTORAGE_TODOS_KEY);
    return SavedTodos ? JSON.parse(SavedTodos) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem(LOCALSTORAGE_CATEGORIES_KEY);
    return SavedCategories ? JSON.parse(SavedCategories) : [];
  });
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_TODOS_KEY, JSON.stringify(todos));
  }, [todos]);
  const GenerateUniqueId = (array: any[]) => {
    const existingIds = new Set(array.map((element) => element.id));
    const MIN_ID = 10000000;
    const MAX_ID = 99999999;
    let newId;
    let isUnique = false;
    while (!isUnique) {
      newId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;
      if (!existingIds.has(newId)) {
        isUnique = true;
      }
    }
    return newId as number;
  };
  const [userSelectedCategory, setUserSelectedCategory] = useState<Category>({
    id: GenerateUniqueId(categories),
    label: "",
    color: "",
  });
  const [todo, setTodo] = useState<Todo>({
    id: GenerateUniqueId(todos),
    label: "",
    category: {
      id: GenerateUniqueId(categories),
      label: "",
      color: "",
    },
    completed: false,
    createdAt: "",
    updatedAt: "",
  });
  const [error, setError] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<any>(null);
  const [editingTodoLabel, setEditingTodoLabel] = useState<string>("");
  const [editingTodoCategory, setEditingTodoCategory] = useState<Category>({
    id: GenerateUniqueId(categories),
    label: "",
    color: "",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTodo({ ...todo, [name]: value });
  };
  const setSelectedCategory = (category: Category) => {
    setUserSelectedCategory(category);
    setTodo({ ...todo, category: category });
  };
  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const UpdatedTodos = todos.map((todo) => {
      if (todo.id === editingIndex) {
        return {
          ...todo,
          label: editingTodoLabel,
          category: editingTodoCategory,
        };
      }
      return todo;
    });
    setTodos(UpdatedTodos);
    setEditingIndex(null);
    setEditingTodoLabel("");
    setEditingTodoCategory({
      id: GenerateUniqueId(categories),
      label: "",
      color: "",
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo.label !== "") {
      setTodos([...todos, todo]);
      setError("");
      setSelectedCategory({
        id: GenerateUniqueId(categories),
        label: "",
        color: "",
      });
      setTodo({
        id: GenerateUniqueId(todos),
        label: "",
        category: {
          id: GenerateUniqueId(categories),
          label: "",
          color: "",
        },
        completed: false,
        createdAt: "",
        updatedAt: "",
      });
    } else {
      setError("Please enter a todo");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <main className={`landing-page relative flex flex-col ${(todos.length > 0) ? "justify-start" : "justify-center"} items-center h-svh w-full bg-gray-100`}>
      <div className={`add-todo flex justify-center items-center h-fit w-full`}>
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`flex flex-col justify-center ${(todos.length > 0) ? "items-start" : "items-center"} gap-4 h-fit w-full p-10`}
        >
          <div className="logo flex justify-center items-center h-fit w-full">
            <p className={`flex justify-center items-center gap-2 h-fit w-full text-4xl font-bold ${(todos.length > 0) ? "justify-between" : "justify-center"}`}>Todolist <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">PRO</span></p>
          </div>
          <Wrapper className="wrapper flex flex-col justify-center items-center gap-4 h-full w-full">
            <div className="flex justify-between items-center gap-7 w-full">
              <div className="flex justify-between items-center gap-7 h-fit w-full">
                <div className="input-field flex w-full">
                  <input
                    type="text"
                    placeholder="Todo"
                    name="label"
                    value={todo.label}
                    onChange={handleChange}
                    className="bg-transparent w-full p-6 border-none outline-none rounded-2xl shadow-md caret-amber-600 tracking-widest hover:shadow-xl focus:shadow-xl transition duration-100 ease-in-out"
                  />
                </div>
                <div className="input-field">
                  <Dropdown
                    placeholder="Category"
                    options={[
                      { id: 45454545, label: "General", color: "#ff00ff" },
                      { id: 45454544, label: "Professional", color: "#00ff00" },
                      { id: 45454546, label: "Personal", color: "#0000ff" },
                    ]}
                    onSelect={(option) => setSelectedCategory(option)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="button flex justify-center items-center gap-3 bg-gray-100 text-gray-900 p-6 rounded-2xl shadow-xl shadow-amber-600/10 text-nowrap hover:shadow-2xl hover:shadow-amber-600/100 hover:bg-gray-900 hover:text-white"
              >
                Add Task
              </button>
            </div>
            {error !== "" && <p className="error text-red-600">{error}</p>}
          </Wrapper>
        </form>
      </div>
      <div className={`todos ${(todos.length > 0) ? "relative" : "absolute"}`}>
        <Wrapper>
          {categories.map((category) => (
            <div className="category" key={category.id}>
              <h2 className="category-label">{category.label}</h2>
              {todos
                .filter((todo) => todo.category === category)
                .map((todo) => (
                  <div className="todos">
                    <div className="todo" key={todo.id}>
                      <div className="checkbox-label">
                        <div
                          className="checkbox"
                          onClick={() => {
                            const UpdatedTodos = todos.map((todo) => {
                              if (todo.id === todo.id) {
                                return {
                                  ...todo,
                                  completed: !todo.completed,
                                };
                              }
                              return todo;
                            });
                            setTodos(UpdatedTodos);
                          }}
                          style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: todo.completed
                              ? category.color
                              : "",
                            border: `2px solid ${category.color}`,
                          }}
                        ></div>
                        <div className="label">
                          <p>{todo.label}</p>
                        </div>
                      </div>
                      <div className="options">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIndex(todo.id);
                            setEditingTodoLabel(todo.label);
                            setEditingTodoCategory(todo.category);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const UpdatedTodos = todos.filter(
                              (todo) => todo.id !== todo.id
                            );
                            setTodos(UpdatedTodos);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </Wrapper>
      </div>
      {editingIndex !== 0 && (
        <div className="edit-container absolute hidden">
          <Wrapper>
            <div className="index-number">Editing Todo: {editingIndex}</div>
            <form
              className="edit-todo-form"
              noValidate
              onSubmit={handleEditSave}
            >
              <div className="todo-info">
                <input
                  type="text"
                  placeholder="Edit your Todo"
                  value={editingTodoLabel}
                  onChange={(e) => setEditingTodoLabel(e.target.value)}
                />
              </div>
              <div className="todo-info">
                <Dropdown
                  placeholder="Category"
                  options={[
                    { id: 45454545, label: "General", color: "#ff00ff" },
                    { id: 45454544, label: "Professional", color: "#00ff00" },
                    { id: 45454546, label: "Personal", color: "#0000ff" },
                  ]}
                  onSelect={(option) => setEditingTodoCategory(option)}
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </Wrapper>
        </div>
      )}
    </main>
  );
};

export default Todos;
