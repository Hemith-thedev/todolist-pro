import { useState, useEffect } from "react";
import { Category } from "../../data/Types";
import Wrapper from "../../components/common/Wrapper";
import Dropdown from "../../components/common/Dropdown";

const Categories = () => {
  const LOCALSTORAGE_KEY = "todolistpro-user-categories";
  const [categories, setCategories] = useState<Category[]>(() => {
    const SavedCategories = localStorage.getItem(LOCALSTORAGE_KEY);
    return (SavedCategories) ? JSON.parse(SavedCategories) : [];
  });
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
  }
  const [category, setCategory] = useState<Category>({
    id: GenerateUniqueId(categories),
    label: "",
    color: "",
  });
  const [colors, setColors] = useState<{ id: number; label: string; color: string }[]>([
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
  const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const UpdatedCategories = categories.map((category) => {
      if (category.id === editingIndex) {
        return {
          ...category,
          labe: editingCategoryLabel,
          color: editingCategoryColor
        }
      }
      return category;
    });
    setCategories(UpdatedCategories);
    setEditingIndex(null);
    setEditingCategoryLabel("");
    setEditingCategoryColor("");
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (category.label !== "") {
      setCategories([...categories, category]);
      setCategory({
        id: GenerateUniqueId(categories),
        label: "",
        color: "",
      });
      setError("");
    } else {
      setError("Please enter a Category");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <main className={`landing-page relative flex flex-col ${(categories.length > 0) ? "justify-start" : "justify-center"} items-center h-svh w-full bg-gray-100`}>
      <div className={`add-category flex justify-center items-center h-fit w-full`}>
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`flex flex-col justify-center ${(categories.length > 0) ? "items-start" : "items-center"} gap-4 h-fit w-full p-10`}
        >
          <div className="logo flex justify-center items-center h-fit w-full">
            <p className={`flex justify-center items-center gap-2 h-fit w-full text-4xl font-bold ${(categories.length > 0) ? "justify-between" : "justify-center"}`}>Todolist <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">PRO</span></p>
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
                    onChange={(e) => setCategory({
                      ...category,
                      label: e.target.value
                    })}
                    className="bg-transparent w-full p-6 border-none outline-none rounded-2xl shadow-md caret-amber-600 tracking-widest hover:shadow-xl focus:shadow-xl transition duration-100 ease-in-out"
                  />
                </div>
                <div className="input-field">
                  <Dropdown
                    placeholder="Colors"
                    options={colors}
                    onSelect={(option) => setCategory({ ...category, color: option.color })}
                  />
                  <div className="color-preview">
                    <div className="color" style={{ backgroundColor: category.color }}></div>
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
      <div className={`todos ${(categories.length > 0) ? "relative" : "absolute"} flex flex-col justify-center items-center gap-4 h-fit w-full px-10`}>
        <p className="text-4xl bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent overflow-visible">Categories</p>
        {
          categories.map((category) => (
            <div className="category flex justify-between items-center gap-7 h-fit w-full rounded-xl shadow-md" key={category.id}>
              <Wrapper className="flex justify-between items-center h-fit w-full px-6 py-3">
                <div className="label">
                  <p>{category.label}</p>
                </div>
                <div className="color flex justify-end items-center gap-3">
                  <div className="preview h-10 w-10 rounded-md" style={{
                    backgroundColor: category.color
                  }}></div>
                  <div className="label">
                    <p>{category.color}</p>
                  </div>
                </div>
              </Wrapper>
            </div>
          ))
        }
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
                  value={editingCategoryLabel}
                  onChange={(e) => setEditingCategoryLabel(e.target.value)}
                />
              </div>
              <div className="todo-info">
                <Dropdown
                  placeholder="Category"
                  options={colors}
                  onSelect={(option) => setEditingCategoryColor(option.color)}
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </Wrapper>
        </div>
      )}
    </main>
  );
}

export default Categories;