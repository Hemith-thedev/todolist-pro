import { useState, useEffect } from "react";
import { Category, Todo } from "../../data/Types"; // 💡 Import Todo type
import Wrapper from "../../components/Wrapper";
import Dropdown from "../../components/Dropdown";
import UseSmoothScroll from "../../hooks/UseSmoothScroll";

const Categories = () => {

  UseSmoothScroll();

  const LOCALSTORAGE_CATEGORIES_KEY = "todolistpro-user-categories";
  const LOCALSTORAGE_TODOS_KEY = "todolistpro-user-todos"; // 💡 Key for todos

  const [categories, setCategories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem(LOCALSTORAGE_CATEGORIES_KEY);
    return SavedCategories ? JSON.parse(SavedCategories) : [];
  });

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

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

  const [category, setCategory] = useState<Category>({
    id: GenerateUniqueId(categories),
    label: "",
    color: "",
  });

  const [colors] = useState<
    { id: number; label: string; color: string }[]
  >([
    { id: 1, label: "Red", color: "hsl(0, 100%, 80%)" },
    { id: 2, label: "Orange", color: "hsl(30, 100%, 80%)" },
    { id: 3, label: "Yellow", color: "hsl(60, 100%, 80%)" },
    { id: 4, label: "Lime", color: "hsl(90, 100%, 80%)" },
    { id: 5, label: "Green", color: "hsl(120, 100%, 80%)" },
    { id: 6, label: "Cyan", color: "hsl(180, 100%, 80%)" },
    { id: 7, label: "Blue", color: "hsl(220, 100%, 80%)" },
    { id: 8, label: "Violet", color: "hsl(270, 100%, 80%)" },
    { id: 9, label: "Magenta", color: "hsl(300, 100%, 80%)" },
    { id: 10, label: "Pink", color: "hsl(320, 100%, 80%)" },
  ]);

  const [error, setError] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState<string>("");
  const [editingCategoryColor, setEditingCategoryColor] = useState<string>("");


  // 💡 FIX: Update todos when category is saved
  const updateTodosInLocalStorage = (updatedCategory: Category) => {
    const todosString = localStorage.getItem(LOCALSTORAGE_TODOS_KEY);
    if (!todosString) return;

    const todos: Todo[] = JSON.parse(todosString);

    const updatedTodos = todos.map(todo => {
      // Check if the todo belongs to the category we just updated
      if (todo.category.id === updatedCategory.id) {
        return {
          ...todo,
          category: { // Update the category object inside the todo
            ...todo.category,
            label: updatedCategory.label,
            color: updatedCategory.color,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return todo;
    });

    localStorage.setItem(LOCALSTORAGE_TODOS_KEY, JSON.stringify(updatedTodos));
  };


  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let categoryToUpdate: Category | undefined;

    const UpdatedCategories = categories.map((cat) => {
      if (cat.id === editingIndex) {
        const updatedCat = {
          ...cat,
          label: editingCategoryLabel,
          color: editingCategoryColor,
        };
        categoryToUpdate = updatedCat; // Capture the updated category
        return updatedCat;
      }
      return cat;
    });

    setCategories(UpdatedCategories);

    // 💡 Execute the fix: Update todos in storage immediately after saving category
    if (categoryToUpdate) {
      updateTodosInLocalStorage(categoryToUpdate);
    }

    setEditingIndex(null);
    setEditingCategoryLabel("");
    setEditingCategoryColor("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (category.label !== "") {
      const newCategory = {
        ...category,
        color: category.color || colors[0].color,
      }

      setCategories([...categories, newCategory]);
      setError("");

      setCategory({
        id: GenerateUniqueId([...categories, newCategory]),
        label: "",
        color: "",
      });
    } else {
      setError("Please enter a Category");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmingDeleteId(id);
  }

  // 💡 FIX: Also handle deletion propagation (though not asked, it's necessary for completeness)
  const handleDeleteConfirm = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setConfirmingDeleteId(null);

    // Remove the category reference from all associated todos
    const todosString = localStorage.getItem(LOCALSTORAGE_TODOS_KEY);
    if (todosString) {
      const todos: Todo[] = JSON.parse(todosString);
      // Option: Filter out todos of the deleted category, or set category to default/null
      const remainingTodos = todos.filter(todo => todo.category.id !== id);
      localStorage.setItem(LOCALSTORAGE_TODOS_KEY, JSON.stringify(remainingTodos));
    }
  }

  const handleStartEdit = (cat: Category) => {
    setEditingIndex(cat.id);
    setEditingCategoryLabel(cat.label);
    setEditingCategoryColor(cat.color);
    setConfirmingDeleteId(null);
  }

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingCategoryLabel("");
    setEditingCategoryColor("");
  }

  const handleCancelDelete = () => {
    setConfirmingDeleteId(null);
  }

  const getInitialColorOption = (colorString: string) => {
    return colors.find(c => c.color === colorString) || {
      id: 0,
      label: "Selected Color",
      color: colorString,
    };
  };

  return (
    <main
      className={`landing-page relative flex flex-col ${categories.length > 0 ? "justify-start" : "justify-center"
        } items-center min-h-svh w-full bg-gray-100`}
    >
      <div
        className={`add-category sticky top-0 flex justify-center items-center h-fit w-full backdrop-blur-xl z-20 overflow-visible`}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`flex flex-col justify-center ${categories.length > 0 ? "items-start" : "items-center"
            } gap-4 h-fit w-full p-10`}
        >
          <div className="logo flex justify-center items-center h-fit w-full">
            <p
              className={`flex justify-center items-center gap-2 h-fit w-full text-4xl font-bold ${categories.length > 0 ? "justify-between" : "justify-center"
                }`}
            >
              Todolist{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                PRO V1
              </span>
            </p>
            <button
              type="button"
              className={`${categories.length > 0 ? "ml-7" : "ml-0 hidden"
                } text-amber-600 p-2 rounded-md hover:text-amber-800 hover:bg-amber-200 hover:shadow-xl hover:shadow-amber-600/50`}
              onClick={() => window.location.pathname = "/"}
            >
              Todos
            </button>
          </div>
          <Wrapper className="wrapper flex flex-col justify-center items-center gap-4 h-full w-full">
            <div className="flex justify-between items-center gap-7 w-full">
              <div className="flex justify-between items-center gap-7 h-fit w-full">
                <div className="input-field flex w-full">
                  <input
                    type="text"
                    placeholder="Category"
                    name="label"
                    value={category.label}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        label: e.target.value,
                      })
                    }
                    className="bg-transparent w-full p-6 border-none outline-none rounded-2xl shadow-md caret-amber-600 tracking-widest hover:shadow-xl focus:shadow-xl transition duration-100 ease-in-out"
                  />
                </div>
                <Dropdown
                  placeholder="Colors"
                  options={colors}
                  onSelect={(option) =>
                    setCategory({ ...category, color: option.color })
                  }
                />
              </div>
              <button
                type="submit"
                className="button flex justify-center items-center gap-3 bg-gray-100 text-gray-900 p-6 rounded-2xl shadow-xl shadow-amber-600/10 text-nowrap hover:shadow-2xl hover:shadow-amber-600/100 hover:bg-gray-900 hover:text-white"
              >
                Add Category
              </button>
            </div>
            {error !== "" && <p className="error text-red-600">{error}</p>}
          </Wrapper>
        </form>
      </div>

      {/* Category List */}
      {categories.length > 0 && (
        <div
          className={`todos ${categories.length > 0 ? "relative" : "absolute"
            } flex flex-col justify-center items-center gap-4 h-fit w-full px-10 z-1 pb-10`}
        >
          <p className="text-2xl bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent overflow-visible">
            Categories
          </p>
          {categories.map((cat) => (
            <div
              className="category flex justify-between items-center gap-7 h-fit w-full rounded-xl shadow-md"
              key={cat.id}
            >
              <Wrapper className="flex justify-between items-center h-fit w-full p-3">
                <div className="info flex justify-between items-center h-fit w-full">
                  {/* Category Display or Edit Form */}
                  {editingIndex === cat.id ? (
                    <form onSubmit={handleEditSave} className="flex gap-4 items-center w-full">
                      <input
                        type="text"
                        value={editingCategoryLabel}
                        onChange={(e) => setEditingCategoryLabel(e.target.value)}
                        className={`bg-transparent w-full rounded-sm p-3 outline-none border-b-amber-600 border-b-2 caret-amber-600 tracking-widest transition duration-100 ease-in-out `}
                      />
                      <Dropdown
                        placeholder="Color"
                        options={colors}
                        initialSelectedOption={getInitialColorOption(editingCategoryColor)}
                        onSelect={(option) => setEditingCategoryColor(option.color)}
                      />
                      <button
                        type="submit"
                        className="text-nowrap text-green-600 p-2 rounded-md hover:text-green-800 hover:bg-green-200 hover:shadow-xl hover:shadow-green-600/50"
                      >Save</button>
                      <button
                        type="button"
                        className="text-nowrap text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
                        onClick={handleCancelEdit}
                      >Cancel</button>
                    </form>
                  ) : (
                    // ... (Display mode remains the same) ...
                    <div className="flex justify-between items-center w-full">
                      <div className="preview-label flex items-center gap-2">
                        <div className="color flex justify-end items-center gap-3">
                          <div
                            className="preview h-10 w-10 rounded-md shadow-inner"
                            style={{
                              backgroundColor: cat.color,
                            }}
                          ></div>
                          <div className="label">
                            <p>{cat.label}</p>
                          </div>
                        </div>
                      </div>
                      <div className="options flex items-center gap-3">
                        {confirmingDeleteId === cat.id ? (
                          <>
                            <p className="text-amber-600">Confirm?</p>
                            <button
                              type="button"
                              className="text-nowrap text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
                              onClick={() => handleDeleteConfirm(cat.id)}>
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              className="text-nowrap text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
                              onClick={handleCancelDelete}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(cat)}
                              disabled={!!confirmingDeleteId}
                              className="text-nowrap text-blue-600 p-2 rounded-md hover:text-blue-800 hover:bg-blue-200 hover:shadow-xl hover:shadow-blue-600/50"
                            >Edit</button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(cat.id)}
                              disabled={!!editingIndex}
                              className="text-nowrap text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Wrapper>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Categories;