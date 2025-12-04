import { useState, useEffect } from "react";
import { Todo, Category } from "../../data/Types";
import Wrapper from "../../components/common/Wrapper";
import Dropdown from "../../components/common/Dropdown";
import TodoCard from "../../components/common/Todo";

const Todos = () => {
  const LOCALSTORAGE_TODOS_KEY = "todolistpro-user-todos";
  const LOCALSTORAGE_CATEGORIES_KEY = "todolistpro-user-categories";

  const [todos, setTodos] = useState<Todo[]>(() => {
    const SavedTodos = localStorage.getItem(LOCALSTORAGE_TODOS_KEY);
    return SavedTodos ? JSON.parse(SavedTodos) : [];
  });

  const [categories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem(LOCALSTORAGE_CATEGORIES_KEY);
    return SavedCategories ? JSON.parse(SavedCategories) : [];
  });

  // NEW STATE for confirmation
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  // ... (GenerateUniqueId and other states remain the same) ...
  const GenerateUniqueId = (array: any[]) => {
    const existingIds = new Set(array.map((element) => element.id));
    let newId;
    let isUnique = false;
    const MIN_ID = 10000000;
    const MAX_ID = 99999999;
    while (!isUnique) {
      newId = Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;
      if (!existingIds.has(newId)) {
        isUnique = true;
      }
    }
    return newId as number;
  };

  const [userSelectedCategory, setUserSelectedCategory] = useState<Category>({
    id: 0,
    label: "",
    color: "",
  });

  const [todo, setTodo] = useState<Todo>({
    id: GenerateUniqueId(todos),
    label: "",
    category: {
      id: 0,
      label: "",
      color: "",
    },
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [error, setError] = useState<string>("");

  // Handlers for the TodoCard

  const handleUpdate = (
    id: number,
    updatedLabel: string,
    updatedCategory: Category
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id
          ? {
              ...t,
              label: updatedLabel,
              category: updatedCategory,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleToggleComplete = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  // UPDATED HANDLER: Starts the confirmation flow (passed to TodoCard's delete button)
  const handleDeleteClick = (id: number) => {
    setConfirmingDeleteId(id);
  };

  // NEW HANDLER: Executes deletion if confirmed (passed to TodoCard's confirmation button)
  const handleDeleteConfirm = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    setConfirmingDeleteId(null);
  };

  // NEW HANDLER: Cancels confirmation (passed to TodoCard's cancel button)
  const handleDeleteCancel = () => {
    setConfirmingDeleteId(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTodo({ ...todo, [name]: value });
  };

  const setSelectedCategory = (category: Category) => {
    setUserSelectedCategory(category);
    setTodo({ ...todo, category: category });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todo.label === "") {
      setError("Please enter a todo");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (todo.category.id === 0) {
      setError("Please select a category");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const newTodoWithTimestamp: Todo = {
      ...todo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: GenerateUniqueId(todos),
    };

    setTodos([...todos, newTodoWithTimestamp]);
    setError("");

    setUserSelectedCategory({ id: 0, label: "", color: "" });
    setTodo({
      id: GenerateUniqueId([...todos, newTodoWithTimestamp]),
      label: "",
      category: { id: 0, label: "", color: "" },
      completed: false,
      createdAt: "",
      updatedAt: "",
    });
  };

  return (
    <main
      className={`landing-page relative flex flex-col ${
        todos.length > 0 ? "justify-start" : "justify-center"
      } items-center min-h-svh w-full bg-gray-100`}
    >
      <div
        className={`add-todo sticky top-0 flex justify-center items-center h-fit w-full backdrop-blur-xl z-20 overflow-visible`}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`flex flex-col justify-center ${
            todos.length > 0 ? "items-start" : "items-center"
          } gap-4 h-fit w-full p-10`}
        >
          <div className="logo flex justify-center items-center h-fit w-full">
            <p
              className={`flex justify-center items-center gap-2 h-fit w-full text-4xl font-bold ${
                todos.length > 0 ? "justify-between" : "justify-center"
              }`}
            >
              Todolist{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                PRO V1
              </span>
            </p>
            <button
              type="button"
              className={`${
                todos.length > 0 ? "ml-7" : "ml-0 hidden"
              } text-amber-600 p-2 rounded-md hover:text-amber-800 hover:bg-amber-200 hover:shadow-xl hover:shadow-amber-600/50`}
              onClick={() => window.location.pathname = "/categories"}
            >
              Categories
            </button>
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
                    options={categories}
                    onSelect={setSelectedCategory}
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
      {todos.length > 0 && (
        <div
          className={`todos ${
            todos.length > 0 ? "relative" : "absolute"
          } flex justify-center items-center h-fit w-full px-10 mb-10`}
        >
          <Wrapper className="wrapper flex flex-col justify-center items-center gap-4 h-full w-full">
            {categories.map((category) => (
              <div
                className="category flex flex-col justify-start items-start gap-2 w-full"
                key={category.id}
              >
                <h2 className="category-label text-xl font-semibold mt-4">
                  {category.label}
                </h2>
                <div className="todos flex flex-col gap-2 w-full">
                  {todos.filter((todo) => todo.category.id === category.id)
                    .length === 0 ? (
                    <p className="no-todos text-gray-500 ml-2">
                      No tasks in this category yet.
                    </p>
                  ) : (
                    todos
                      .filter((todo) => todo.category.id === category.id)
                      .map((todo) => (
                        <TodoCard
                          key={todo.id}
                          {...todo}
                          categories={categories}
                          onUpdate={handleUpdate}
                          onToggleComplete={handleToggleComplete}
                          // PASSING CONFIRMATION LOGIC DOWN
                          onDeleteClick={handleDeleteClick}
                          isConfirming={confirmingDeleteId === todo.id}
                          onDeleteConfirm={handleDeleteConfirm}
                          onDeleteCancel={handleDeleteCancel}
                        />
                      ))
                  )}
                </div>
              </div>
            ))}
          </Wrapper>
        </div>
      )}
    </main>
  );
};

export default Todos;
