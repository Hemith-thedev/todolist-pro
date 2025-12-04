import { useState, useEffect } from "react";
import { Category } from "../../data/Types";
import Wrapper from "../../components/common/Wrapper";
import Dropdown from "../../components/common/Dropdown";

const Categories = () => {
  const LOCALSTORAGE_KEY = "todolistpro-user-categories";
  const [categories, setCategories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem(LOCALSTORAGE_KEY);
    return SavedCategories ? JSON.parse(SavedCategories) : [];
  });

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(categories));
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

  // Color options defined as objects (Category/DropdownOptionOptions)
  const [colors] = useState<{ id: number; label: string; color: string }[]>([
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
  // editingCategoryColor now holds the HSL string
  const [editingCategoryColor, setEditingCategoryColor] = useState<string>("");

  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const UpdatedCategories = categories.map((cat) => {
      if (cat.id === editingIndex) {
        return {
          ...cat,
          label: editingCategoryLabel,
          color: editingCategoryColor,
        };
      }
      return cat;
    });
    setCategories(UpdatedCategories);
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
      };

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
  };

  const handleDeleteConfirm = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setConfirmingDeleteId(null);
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

  // Helper function to find the color object for the current editing color string
  const getInitialColorOption = (colorString: string) => {
    return (
      colors.find((c) => c.color === colorString) || {
        id: 0,
        label: "Selected Color",
        color: colorString, // Use the string directly if not found in options
      }
    );
  };

  return (
    <main
      className={`landing-page relative flex flex-col ${
        categories.length > 0 ? "justify-start" : "justify-center"
      } items-center min-h-svh w-full bg-gray-100`}
    >
      {/* ... (Form for adding new category remains the same) ... */}
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
          <div className="logo flex justify-center items-center h-fit w-full">
            <p
              className={`flex justify-center items-center gap-2 h-fit w-full text-4xl font-bold ${
                categories.length > 0 ? "justify-between" : "justify-center"
              }`}
            >
              Todolist{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                PRO
              </span>
            </p>
            <button
              type="button"
              className={`${
                categories.length > 0 ? "ml-7" : "ml-0 hidden"
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
                <div className="input-field flex gap-7 items-center">
                  <Dropdown
                    placeholder="Colors"
                    options={colors}
                    onSelect={(option) =>
                      setCategory({ ...category, color: option.color })
                    }
                  />
                  <div className="color-preview mt-2">
                    <div
                      className="color h-16 w-6 rounded-full shadow-md"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>
                </div>
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
              <Wrapper className="flex justify-between items-center h-fit w-full p-3">
                <div className="info flex justify-between items-center h-fit w-full">
                  {/* Category Display or Edit Form */}
                  {editingIndex === cat.id ? (
                    <form
                      onSubmit={handleEditSave}
                      className="flex gap-4 items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={editingCategoryLabel}
                          onChange={(e) =>
                            setEditingCategoryLabel(e.target.value)
                          }
                          className="bg-transparent w-full rounded-sm p-3 outline-none border-b-amber-600 border-b-2 caret-amber-600 tracking-widest transition duration-100 ease-in-out"
                        />
                        <Dropdown
                          placeholder="Color"
                          options={colors}
                          // --- 💡 FIX APPLIED HERE ---
                          // Pass the current color object to initialize the dropdown.
                          initialSelectedOption={getInitialColorOption(
                            editingCategoryColor
                          )}
                          // --- 💡 END FIX ---
                          onSelect={(option) =>
                            setEditingCategoryColor(option.color)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 w-fit">
                        <button
                          type="submit"
                          className="text-blue-600 p-2 rounded-md hover:text-blue-800 hover:bg-blue-200 hover:shadow-xl hover:shadow-blue-600/50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // ... (Display mode remains the same) ...
                    <div className="flex justify-between items-center w-full">
                      <div className="color-label flex gap-2 items-center">
                        <div className="color flex justify-end items-center gap-3">
                          <div
                            className="preview h-10 w-10 rounded-md shadow-inner"
                            style={{
                              backgroundColor: cat.color,
                            }}
                          ></div>
                        </div>
                        <div className="label">
                          <p>{cat.label}</p>
                        </div>
                      </div>
                      <div className="options flex items-center gap-3">
                        {confirmingDeleteId === cat.id ? (
                          <>
                            <p className="text-amber-600">Are you sure?</p>
                            <button
                              type="button"
                              className="text-nowrap text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
                              onClick={() => handleDeleteConfirm(cat.id)}
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              className="text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
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
                              className="text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(cat.id)}
                              disabled={!!editingIndex}
                              className="text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
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
