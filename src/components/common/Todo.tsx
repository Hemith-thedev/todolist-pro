import { useState } from "react";
import { Todo, Category } from "../../data/Types";
import { Check } from "lucide-react";
import Dropdown from "./Dropdown";

interface TodoCardProps extends Todo {
  categories: Category[];
  onUpdate: (
    id: number,
    updatedLabel: string,
    updatedCategory: Category
  ) => void;
  onToggleComplete: (id: number) => void;
  // NEW PROPS for confirmation flow
  onDeleteClick: (id: number) => void;
  isConfirming: boolean;
  onDeleteConfirm: (id: number) => void;
  onDeleteCancel: () => void;
}

const TodoCard = ({
  id,
  label,
  category,
  completed,
  categories,
  onUpdate,
  onToggleComplete,
  onDeleteClick,
  isConfirming,
  onDeleteConfirm,
  onDeleteCancel,
}: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTodoLabel, setEditingTodoLabel] = useState<string>(label);
  const [editingTodoCategory, setEditingTodoCategory] =
    useState<Category>(category);

  const handleSaveEdit = () => {
    onUpdate(id, editingTodoLabel, editingTodoCategory);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditingTodoLabel(label);
    setEditingTodoCategory(category);
  };

  const handleToggleComplete = () => {
    onToggleComplete(id);
  };

  // UPDATED RENDER LOGIC
  return (
    <div className="todo flex justify-between items-center gap-2 p-4 shadow-md rounded-xl bg-gray-100">
      <div className="checkbox-label flex items-center gap-3 w-full">
        <div
          className="checkbox flex justify-center items-center h-5 w-5 cursor-pointer rounded-full transition duration-150"
          style={{
            backgroundColor: completed ? category.color : "transparent",
            border: completed ? "none" : `2px solid ${category.color}`,
          }}
          onClick={!isEditing ? handleToggleComplete : undefined}
        >
          {completed ? <Check className="h-4 w-4 text-white" /> : null}
        </div>
        <div className="label w-full">
          {isEditing ? (
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                value={editingTodoLabel}
                onChange={(e) => setEditingTodoLabel(e.target.value)}
                className="bg-transparent w-full rounded-sm p-3 outline-none border-b-amber-600 border-b-2 caret-amber-600 tracking-widest transition duration-100 ease-in-out"
              />
              <Dropdown
                placeholder="Select Category"
                options={categories}
                // --- 💡 FIX APPLIED HERE ---
                // We pass the current category object to the Dropdown so it initializes the selection correctly.
                initialSelectedOption={editingTodoCategory}
                // --- 💡 END FIX ---
                onSelect={setEditingTodoCategory}
              />
            </div>
          ) : (
            <p style={{ '--color': category.color } as React.CSSProperties} className={`${completed ? "line-through text-gray-500" : ""} selection:bg-[var(--color)] selection:text-gray-900`}>
              {label}
            </p>
          )}
        </div>
      </div>
      <div className="options flex gap-3 items-center">
        {isConfirming ? (
          // CONFIRMATION UI (No change needed here)
          <>
            <p className="text-amber-600 text-nowrap">Are you sure?</p>
            <button
              type="button"
              className="text-nowrap text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
              onClick={() => onDeleteConfirm(id)}
            >
              Yes, Delete
            </button>
            <button
              type="button"
              className="text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
              onClick={onDeleteCancel}
            >
              Cancel
            </button>
          </>
        ) : isEditing ? (
          // EDITING UI (No change needed here)
          <>
            <button
              type="button"
              className="save text-blue-600 p-2 rounded-md hover:text-blue-800 hover:bg-blue-200 hover:shadow-xl hover:shadow-blue-600/50"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              type="button"
              className="cancel text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          // DEFAULT UI (No change needed here)
          <>
            <button
              type="button"
              className="edit text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
              onClick={handleStartEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="delete text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
              onClick={() => onDeleteClick(id)}
              disabled={isEditing}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
