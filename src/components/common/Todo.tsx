import { useState } from "react";
import { Todo, Category } from "../../data/Types";
import { Check } from "lucide-react";
import Dropdown from "./Dropdown";

interface TodoCardProps extends Todo {
  categories: Category[];
  onUpdate: (id: number, updatedLabel: string, updatedCategory: Category) => void;
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
  }

  // UPDATED RENDER LOGIC
  return (
    <div className="todo flex justify-between items-center p-4 shadow-md rounded-xl bg-gray-100">
      <div className="checkbox-label flex items-center gap-3">
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
        <div className="label">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={editingTodoLabel}
                onChange={(e) => setEditingTodoLabel(e.target.value)}
                className="bg-transparent w-full p-6 border-none outline-none rounded-md shadow-md caret-amber-600 tracking-widest hover:shadow-xl focus:shadow-xl transition duration-100 ease-in-out"
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
            <p className={completed ? "line-through text-gray-500" : ""}>{label}</p>
          )}
        </div>
      </div>
      <div className="options flex gap-3 items-center">

        {isConfirming ? (
          // CONFIRMATION UI (No change needed here)
          <>
            <p className="text-red-500 text-sm">Delete?</p>
            <button
              type="button"
              className="text-white bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
              onClick={() => onDeleteConfirm(id)}
            >
              Yes
            </button>
            <button
              type="button"
              className="text-gray-900 bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400"
              onClick={onDeleteCancel}
            >
              Cancel
            </button>
          </>
        ) : isEditing ? (
          // EDITING UI (No change needed here)
          <>
            <button type="button" className="save text-blue-600 hover:text-blue-800" onClick={handleSaveEdit}>
              Save
            </button>
            <button type="button" className="cancel text-gray-600 hover:text-gray-800" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          // DEFAULT UI (No change needed here)
          <>
            <button
              type="button"
              className="edit text-gray-600 hover:text-gray-800"
              onClick={handleStartEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="delete text-red-600 hover:text-red-800"
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