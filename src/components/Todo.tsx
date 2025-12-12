import { useState } from "react";
import { Todo, Category } from "../data/Types";
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
  // 🔑 Renamed: This function now executes the delete immediately
  onDelete: (id: number) => void;
  // 🗑️ Removed confirmation props:
  // isConfirming: boolean;
  // onDeleteConfirm: (id: number) => void;
  // onDeleteCancel: () => void;
}

const TodoCard = ({
  id,
  label,
  category,
  completed,
  categories,
  onUpdate,
  onToggleComplete,
  // 🔑 Updated prop name
  onDelete,
}: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTodoLabel, setEditingTodoLabel] = useState<string>(label);
  const [editingTodoCategory, setEditingTodoCategory] =
    useState<Category>(category);

  // --- NEW STATE FOR INLINE ERROR FEEDBACK ---
  const [showLabelError, setShowLabelError] = useState<boolean>(false);
  const [showCategoryError, setShowCategoryError] = useState<boolean>(false);

  const handleSaveEdit = () => {
    let isValid = true;

    // 1. Validate Label
    if (editingTodoLabel.trim() === "") {
      setShowLabelError(true);
      isValid = false;
    } else {
      setShowLabelError(false);
    }

    // 2. Validate Category
    // Assuming a valid category has an 'id' and 'label'
    if (
      !editingTodoCategory ||
      editingTodoCategory.id === 0 ||
      editingTodoCategory.label === ""
    ) {
      setShowCategoryError(true);
      isValid = false;
    } else {
      setShowCategoryError(false);
    }

    if (isValid) {
      onUpdate(id, editingTodoLabel, editingTodoCategory);
      setIsEditing(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditingTodoLabel(label);
    setEditingTodoCategory(category);
    // Reset errors when starting edit
    setShowLabelError(false);
    setShowCategoryError(false);
  };

  const handleToggleComplete = () => {
    onToggleComplete(id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset errors when cancelling edit
    setShowLabelError(false);
    setShowCategoryError(false);
  };

  // UPDATED RENDER LOGIC
  return (
    <div className="todo flex justify-between items-center gap-2 p-4 shadow-md rounded-xl bg-gray-100 max-md:flex-col max-md:items-start">
      <div className="checkbox-label flex items-start gap-3 w-full">
        {!isEditing && (
          <div
            className="checkbox flex justify-center items-center min-h-5 min-w-5 w-5 mt-0.5 cursor-pointer rounded-full transition duration-150"
            style={{
              backgroundColor: completed ? category.color : "transparent",
              border: completed ? "none" : `2px solid ${category.color}`,
            }}
            onClick={!isEditing ? handleToggleComplete : undefined}
          >
            {completed ? <Check className="h-4 w-4 text-white" /> : null}
          </div>
        )}
        <div className="label w-full">
          {isEditing ? (
            <div className="flex flex-col gap-2 w-full">
              {" "}
              {/* Changed to flex-col to stack input and error message */}
              <div className="flex gap-2 items-center w-full max-md:flex-col max-md:items-start">
                <input
                  type="text"
                  value={editingTodoLabel}
                  // 💡 PLACEHOLDER CHANGE: Show error text when validation fails
                  placeholder={showLabelError ? "Enter your Todo" : ""}
                  onChange={(e) => {
                    setEditingTodoLabel(e.target.value);
                    // Clear error as user types
                    setShowLabelError(false);
                  }}
                  className={`bg-transparent w-full rounded-sm p-3 outline-none border-b-amber-600 border-b-2 caret-amber-600 tracking-widest transition duration-100 ease-in-out`}
                />
                <Dropdown
                  placeholder={
                    showCategoryError ? "Select a Category" : "Select Category"
                  }
                  options={categories}
                  initialSelectedOption={editingTodoCategory}
                  // 💡 CATEGORY SELECT CHANGE: Clear error when a selection is made
                  onSelect={(option) => {
                    setEditingTodoCategory(option);
                    setShowCategoryError(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <p
              style={{ "--color": category.color } as React.CSSProperties}
              className={`${completed ? "line-through text-gray-500" : ""
                } selection:bg-[var(--color)] selection:text-gray-900 cursor-pointer`}
              onClick={() => {
                // if not in editing mode, toggle check / uncheck
                onToggleComplete(id)
              }}
            >
              {label}
            </p>
          )}
        </div>
      </div>
      <div className="options flex gap-3 items-center">
        {/* 🗑️ REMOVED CONFIRMATION UI BLOCK */}
        {isEditing ? (
          // EDITING UI
          <>
            <button
              type="button"
              className="save text-green-600 p-2 rounded-md hover:text-green-800 hover:bg-green-200 hover:shadow-xl hover:shadow-green-600/50"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              type="button"
              className="cancel text-gray-600 p-2 rounded-md hover:text-gray-800 hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-600/50"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          // DEFAULT UI (now shows Edit and Immediate Delete)
          <>
            <button
              type="button"
              className="edit text-blue-600 p-2 rounded-md hover:text-blue-800 hover:bg-blue-200 hover:shadow-xl hover:shadow-blue-600/50"
              onClick={handleStartEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="delete text-red-600 p-2 rounded-md hover:text-red-800 hover:bg-red-200 hover:shadow-xl hover:shadow-red-600/50"
              // 🔑 Immediate delete execution
              onClick={() => onDelete(id)}
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