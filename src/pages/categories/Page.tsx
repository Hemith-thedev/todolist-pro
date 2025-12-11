import { useState, useEffect } from "react";
import { Category, Todo } from "../../data/Types";
import { PredefinedCategories } from "../../data/Content";
import Wrapper from "../../components/Wrapper";
import Dropdown from "../../components/Dropdown";
import UseSmoothScroll from "../../hooks/UseSmoothScroll";

// Define the initial state for a new category
const initialCategoryState: Category = {
  id: 0,
  label: "",
  color: "",
};

const Categories = () => {
  UseSmoothScroll();

  const LOCALSTORAGE_CATEGORIES_KEY = "todolistpro-user-categories";
  const LOCALSTORAGE_TODOS_KEY = "todolistpro-user-todos";

  const [categories, setCategories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem(LOCALSTORAGE_CATEGORIES_KEY);
    return SavedCategories ? JSON.parse(SavedCategories) : [];
  });

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem(
      LOCALSTORAGE_CATEGORIES_KEY,
      JSON.stringify(categories)
    );
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

  // 🔑 State initialized and used for reset
  const [category, setCategory] = useState<Category>(initialCategoryState);

  // Utility function to find the color option object from the color string
  const getColorOptionByValue = (colorString: string) => {
    return (
      colors.find((c) => c.color === colorString) || {
        id: 0,
        label: "Select Color",
        color: "",
      }
    );
  };

  // Utility function to find the label option object from the label string
  const getLabelOptionByValue = (labelString: string) => {
    return (
      PredefinedCategories.find((c) => c.label === labelString) || {
        id: 0,
        label: "Select Category",
        color: "",
      }
    );
  };

  // const [colors] = useState<{ id: number; label: string; color: string }[]>([
  //   { id: 1, label: "Red", color: "hsl(0, 100%, 60%)" },
  //   { id: 2, label: "Orange", color: "hsl(30, 100%, 60%)" },
  //   { id: 3, label: "Yellow", color: "hsl(60, 100%, 70%)" },
  //   { id: 4, label: "Lime", color: "hsl(90, 100%, 70%)" },
  //   { id: 5, label: "Green", color: "hsl(140, 100%, 50%)" },
  //   { id: 6, label: "Cyan", color: "hsl(180, 100%, 70%)" },
  //   { id: 7, label: "Blue", color: "hsl(220, 100%, 60%)" },
  //   { id: 8, label: "Violet", color: "hsl(270, 100%, 70%)" },
  //   { id: 9, label: "Magenta", color: "hsl(300, 100%, 70%)" },
  //   { id: 10, label: "Pink", color: "hsl(320, 100%, 70%)" },
  // ]);

  const [colors] = useState<{ id: number; label: string; color: string }[]>([
    { id: 1, label: "Red", color: "hsl(0, 100%, 60%)" },
    { id: 2, label: "Orange", color: "hsl(30, 100%, 60%)" },
    { id: 3, label: "Green", color: "hsl(140, 100%, 50%)" },
    { id: 4, label: "Blue", color: "hsl(220, 100%, 60%)" },
    { id: 5, label: "Pink", color: "hsl(320, 100%, 70%)" },
  ]);

  const [error, setError] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState<string>("");
  const [editingCategoryColor, setEditingCategoryColor] = useState<string>("");

  const updateTodosInLocalStorage = (updatedCategory: Category) => {
    const todosString = localStorage.getItem(LOCALSTORAGE_TODOS_KEY);
    if (!todosString) return;

    const todos: Todo[] = JSON.parse(todosString);
    const updatedTodos = todos.map((todo) => {
      if (todo.category.id === updatedCategory.id) {
        return {
          ...todo,
          category: {
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
    if (
      editingCategoryLabel.trim() === "" ||
      editingCategoryColor.trim() === ""
    ) {
      setError("Category label and color cannot be empty.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    let categoryToUpdate: Category | undefined;

    const UpdatedCategories = categories.map((cat) => {
      if (cat.id === editingIndex) {
        const updatedCat = {
          ...cat,
          label: editingCategoryLabel,
          color: editingCategoryColor,
        };
        categoryToUpdate = updatedCat;
        return updatedCat;
      }
      return cat;
    });

    setCategories(UpdatedCategories);

    if (categoryToUpdate) {
      updateTodosInLocalStorage(categoryToUpdate);
    }

    setEditingIndex(null);
    setEditingCategoryLabel("");
    setEditingCategoryColor("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. VALIDATION: Check if both category type (label) and color are selected
    if (category.label === "" || category.color === "" || category.id === 0) {
      setError("Please select both a Category type and a Color.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    // Check if category already exists
    if (categories.some((cat) => cat.label === category.label)) {
      setError(`Category '${category.label}' is already activated.`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    // 2. CREATE NEW CATEGORY
    const newCategory = {
      ...category,
      id: GenerateUniqueId(categories), // Ensure new ID is generated here
      color: category.color,
    };

    setCategories([...categories, newCategory]);
    setError("");

    // 3. 🔑 RESET FORM: Set the category state back to the initial state
    setCategory(initialCategoryState);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmingDeleteId(id);
  };

  const handleDeleteConfirm = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setConfirmingDeleteId(null);

    const todosString = localStorage.getItem(LOCALSTORAGE_TODOS_KEY);
    if (todosString) {
      const todos: Todo[] = JSON.parse(todosString);
      const remainingTodos = todos.filter((todo) => todo.category.id !== id);
      localStorage.setItem(
        LOCALSTORAGE_TODOS_KEY,
        JSON.stringify(remainingTodos)
      );
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingIndex(cat.id);
    setEditingCategoryLabel(cat.label);
    setEditingCategoryColor(cat.color);
    setConfirmingDeleteId(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingCategoryLabel("");
    setEditingCategoryColor("");
  };

  const handleCancelDelete = () => {
    setConfirmingDeleteId(null);
  };

  const getInitialColorOptionEdit = (colorString: string) => {
    return (
      colors.find((c) => c.color === colorString) || {
        id: 0,
        label: "Selected Color",
        color: colorString,
      }
    );
  };

  return (
    <main
      className={`landing-page relative flex flex-col ${
        categories.length > 0 ? "justify-start" : "justify-center"
      } items-center min-h-svh w-full bg-gray-100`}
    >
      <div
        className={`add-category sticky top-0 flex justify-center items-center h-fit w-full backdrop-blur-xl z-20 overflow-visible`}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`flex flex-col justify-center ${
            categories.length > 0 ? "items-start" : "items-center"
          } gap-4 h-fit w-full p-10`}
        >
          <div
            className={`logo flex justify-center items-center h-fit w-full max-md:justify-between max-md:items-start`}
          >
            <p
              className={`flex justify-center items-center gap-2 h-fit w-full text-4xl font-bold ${
                categories.length > 0 ? "justify-between" : "justify-center"
              } ${
                categories.length > 0
                  ? "max-md:justify-between max-md:flex-col max-md:items-start"
                  : ""
              }`}
            >
              <span className="max-md:text-3xl">Todolist</span>
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent max-md:text-3xl">
                PRO V1
              </span>
            </p>
            <button
              type="button"
              className={`${
                categories.length > 0 ? "ml-7" : "ml-0 hidden"
              } text-amber-600 p-2 rounded-md hover:text-amber-800 hover:bg-amber-200 hover:shadow-xl hover:shadow-amber-600/50`}
              onClick={() => (window.location.pathname = "/")}
            >
              Todos
            </button>
          </div>
          <Wrapper className="wrapper flex flex-col justify-center items-center gap-4 h-full w-full">
            <div className="flex justify-center items-center gap-7 w-full max-md:flex-col max-md:gap-4">
              <div className="flex justify-center items-center gap-7 h-fit w-fit max-md:flex-col max-md:gap-4">
                <div className="flex h-fit w-fit z-20">
                  <Dropdown
                    placeholder="Activate Category"
                    options={PredefinedCategories}
                    onSelect={(option) =>
                      setCategory({
                        ...category,
                        id: option.id,
                        label: option.label,
                      })
                    }
                    // 🔑 Pass current category label for controlled state/reset
                    initialSelectedOption={getLabelOptionByValue(
                      category.label
                    )}
                    // isColorSelector={false}
                  />
                </div>
                <div className="flex h-fit w-fit z-10">
                  <Dropdown
                    placeholder="Colors"
                    options={colors}
                    onSelect={(option) =>
                      setCategory({
                        ...category,
                        color: option.color,
                      })
                    }
                    // 🔑 Pass current category color for controlled state/reset
                    initialSelectedOption={getColorOptionByValue(
                      category.color
                    )}
                    // isColorSelector={true}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="button flex justify-center items-center gap-3 bg-gray-100 text-gray-900 p-6 rounded-2xl shadow-xl shadow-amber-600/10 text-nowrap hover:shadow-2xl hover:shadow-amber-600/100 hover:bg-gray-900 hover:text-white max-md:w-full"
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
          className={`todos ${
            categories.length > 0 ? "relative" : "absolute"
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
              <Wrapper className="flex justify-between items-center h-fit w-full p-3 max-md:flex-col max-md:items-start max-md:gap-3">
                <div className="info flex justify-between items-center h-fit w-full max-md:flex-col max-md:items-start max-md:gap-3">
                  {/* Category Display or Edit Form */}
                  {editingIndex === cat.id ? (
                    <form
                      onSubmit={handleEditSave}
                      className="flex gap-4 items-center w-full max-md:flex-col max-md:gap-2 max-md:items-start"
                    >
                      <div className="flex items-center gap-4 max-md:flex-col max-md:gap-2 w-full max-md:items-start">
                        <div className="label mx-4 max-md:mx-2">
                          <p>{cat.label}</p>
                        </div>
                        <Dropdown
                          placeholder="Color"
                          options={colors}
                          initialSelectedOption={getInitialColorOptionEdit(
                            editingCategoryColor
                          )}
                          onSelect={(option) =>
                            setEditingCategoryColor(option.color)
                          }
                          // isColorSelector={true}
                        />
                      </div>
                      <div className="flex items-center max-md:w-full max-md:justify-end">
                        <button
                          type="submit"
                          className="text-nowrap text-green-600 p-2 rounded-md hover:text-green-800 hover:bg-green-200 hover:shadow-xl hover:shadow-green-600/50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="text-nowrap text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display mode
                    <div className="flex justify-between items-center w-full max-md:flex-col max-md:items-start max-md:gap-2">
                      <div className="preview-label flex items-center gap-2">
                        <div className="color flex justify-end items-center gap-3">
                          <div
                            className="preview h-10 w-10 rounded-md shadow-inner max-md:w-2"
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
                              onClick={() => handleDeleteConfirm(cat.id)}
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              className="text-nowrap text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
                              onClick={handleCancelDelete}
                            >
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
                            >
                              Edit
                            </button>
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
