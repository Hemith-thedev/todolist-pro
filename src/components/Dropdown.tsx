import { useState, useRef, useEffect } from "react";
import { DropdownOptions, DropdownOptionOptions } from "../data/Types";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Note: You must ensure DropdownOptionOptions includes the 'color' property.
// Based on previous context, this is the Category interface.

interface DropdownProps extends DropdownOptions {
  // FIX 1: Type change from previous conversation allows null for reset
  initialSelectedOption?: DropdownOptionOptions | null;
  isColorSelector?: boolean;
}

const Dropdown = ({
  placeholder,
  options,
  onSelect,
  initialSelectedOption,
  isColorSelector,
}: DropdownProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State to track direction, initialized to open down/right
  const [menuDirection, setMenuDirection] = useState<{
    x: "right" | "left";
    y: "down" | "up";
  }>({ x: "right", y: "down" });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // FIX 2: Handle initialSelectedOption being null explicitly for the state reset.
  const [selected, setSelected] = useState<DropdownOptionOptions>(
    initialSelectedOption ?? { id: 0, label: "", color: "" }
  );

  // FIX 3: Sync internal state with external prop (for reset/initial load)
  useEffect(() => {
    setSelected(initialSelectedOption ?? { id: 0, label: "", color: "" });
  }, [initialSelectedOption]);

  const handleSelect = (option: DropdownOptionOptions) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💡 Dynamic positioning logic
  useEffect(() => {
    if (isOpen && dropdownRef.current && menuRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const menuWidth = menuRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX: "right" | "left" = "right";
      let newY: "down" | "up" = "down";

      // --- Horizontal Check (Right Edge Collision) ---
      if (dropdownRect.left + menuWidth > viewportWidth) {
        newX = "left";
      }

      // --- Vertical Check (Bottom Edge Collision) ---
      const spaceBelow = viewportHeight - dropdownRect.bottom;

      if (spaceBelow < menuHeight) {
        const spaceAbove = dropdownRect.top;
        if (spaceAbove >= menuHeight) {
          newY = "up";
        }
      }

      setMenuDirection((prev) => {
        if (prev.x !== newX || prev.y !== newY) {
          return { x: newX, y: newY };
        }
        return prev;
      });
    }
  }, [isOpen]);
  // 💡 END Dynamic positioning logic

  // --- STYLING IMPLEMENTATION ---

  // Use selected.color if a category is selected (id !== 0)
  const isSelected = selected.id !== 0;

  // 🔑 THE FIX: Use React.CSSProperties & { [key: string]: any } to allow custom CSS variables
  const buttonDynamicStyle: React.CSSProperties & { [key: string]: any } = {
    // 1. Dynamic Background Color: Used when selected and not open
    backgroundColor: isSelected && !isOpen ? selected.color : undefined,

    // 2. Dynamic Text Color: Ensure contrast
    color: isSelected && !isOpen ? "rgb(7, 24, 39)" : undefined,

    // 3. Dynamic Shadow Color (The Fix)
    '--selected-shadow-color': isSelected ? selected.color : 'transparent',
    
    // 4. Use the CSS variable in the standard box-shadow property
    boxShadow: isSelected && !isOpen 
        ? `0 25px 50px -12px var(--selected-shadow-color)` // large shadow
        : undefined,
  };

  return (
    <div
      className="dropdown relative flex flex-col justify-start items-center h-fit w-fit max-md:w-full"
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`dropdown-button button flex justify-center items-center gap-3 p-6 rounded-2xl text-nowrap cursor-pointer transition duration-150 
          ${
            isOpen
              ? `bg-gray-900 text-white shadow-2xl shadow-amber-600/100`
              : `bg-gray-100 text-gray-900 shadow-xl shadow-amber-600/10`
          }
          ${isSelected ? `bg-gray-900 shadow-2xl shadow-amber-600/50` : ``}
        z-1 max-md:w-full max-md:justify-between max-md:p-3 max-md:rounded-lg`}
        // Use inline style for button color if it's a category color (since Tailwind can't read variables for bg-color)
        style={(isColorSelector) ? buttonDynamicStyle : {}}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className={`
          ${isSelected ? `${isColorSelector ? `text-gray-900` : `text-white`}` : ``}
          ${isOpen ? `${isColorSelector ? `text-white` : `text-white`}` : ``}
          `}>
          {selected.label !== "" ? selected.label : placeholder}
        </p>
        <div
          className={`icon
            ${isSelected ? `${isColorSelector ? `text-gray-900` : `text-white`}` : ``}
            ${isOpen ? `${isColorSelector ? `text-white` : `text-white`}` : ``}
            transition-transform duration-200`}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown />
        </div>
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className={`
                dropdown-menu absolute rounded-2xl bg-gray-100 shadow-2xl shadow-gray-300 overflow-hidden z-2 w-full min-w-max 
                ${
            menuDirection.y === "down" ? "top-full mt-2" : "bottom-full mb-2"
          } 
                ${menuDirection.x === "right" ? "left-0" : "right-0"} 
            `}
        >
          <ul
            data-lenis-prevent
            className={`dropdown-list flex flex-col justify-start items-center max-h-48 h-fit w-full p-2 bg-gray-100 overflow-y-auto`}
          >
            {/* Placeholder/Reset Option */}
            <li
              onClick={() => handleSelect({ id: 0, label: "", color: "" })}
              className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 transition duration-150 
                  ${
                    selected.id === 0
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } cursor-pointer`}
            >
              <p className="text-gray-500">{placeholder}</p>
            </li>

            {/* Category Options */}
            {options.map((option) => (
              <li
                key={option.id}
                className={`flex items-center h-fit w-full rounded-md px-5 py-2 transition duration-150 relative 
                  ${
                    selected.id === option.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } cursor-pointer`}
                onClick={() => handleSelect(option)}
              >
                {/* 🎨 Category Color Indicator */}
                {option.color !== "" && (
                  <span
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                <p>{option.label}</p>
              </li>
            ))}

            {/* Add Category Link */}
            {window.location.pathname !== "/categories" && (
              <li
                onClick={() => navigate("/categories")}
                className="flex justify-center items-center h-fit w-full rounded-md px-5 py-2 text-nowrap bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer transition duration-150 border-t mt-2 border-gray-300 pt-2"
              >
                <p>Add Category</p>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
