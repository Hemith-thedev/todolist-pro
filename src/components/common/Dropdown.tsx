import { useState, useRef, useEffect } from "react";
import { DropdownOptions, DropdownOptionOptions } from "../../data/Types";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DropdownProps extends DropdownOptions {
  initialSelectedOption?: DropdownOptionOptions;
}

const Dropdown = ({ placeholder, options, onSelect, initialSelectedOption }: DropdownProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State to track direction, initialized to open down/right
  const [menuDirection, setMenuDirection] = useState<{ x: 'right' | 'left', y: 'down' | 'up' }>({ x: 'right', y: 'down' });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<DropdownOptionOptions>(
    initialSelectedOption || { id: 0, label: "", color: "" }
  );

  const handleSelect = (option: DropdownOptionOptions) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  // 💡 FIX APPLIED HERE: Logic is now more stable and uses button position for reference.
  useEffect(() => {
    if (isOpen && dropdownRef.current && menuRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight;
      const menuWidth = menuRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX: 'right' | 'left' = 'right';
      let newY: 'down' | 'up' = 'down';

      // --- Horizontal Check (Right Edge Collision) ---
      // If the menu, when opening to the right, goes outside the screen
      if (dropdownRect.left + menuWidth > viewportWidth) {
        newX = 'left';
      }

      // --- Vertical Check (Bottom Edge Collision) ---
      // If the menu, when opening downwards, goes outside the screen
      const spaceBelow = viewportHeight - dropdownRect.bottom;

      if (spaceBelow < menuHeight) {
        const spaceAbove = dropdownRect.top;

        // If space below is less than menu height, and space above is sufficient, flip up.
        if (spaceAbove >= menuHeight) {
          newY = 'up';
        }
        // NOTE: If space above is also insufficient, we stick to 'down' 
        // or a default, preventing the continuous flip. Sticking to 'down' here.
      }


      // ONLY update state if the calculated direction is different from the current state.
      setMenuDirection(prev => {
        if (prev.x !== newX || prev.y !== newY) {
          return { x: newX, y: newY };
        }
        return prev;
      });
    }
    // Dependency array changed: menuDirection is removed to prevent the dance
  }, [isOpen]);
  // 💡 END FIX

  return (
    <div
      className="dropdown relative flex flex-col justify-start items-center h-fit w-fit"
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`dropdown-button button flex justify-center items-center gap-3 p-6 rounded-2xl text-nowrap cursor-pointer hover:bg-gray-900 hover:text-white ${isOpen
            ? "shadow-2xl shadow-amber-600/100 bg-gray-900 text-white"
            : "shadow-xl shadow-amber-600/10 bg-gray-100 text-gray-900"
          } z-1`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{selected.label !== "" ? selected.label : placeholder}</p>
        <div
          className="icon transition-transform duration-200"
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
          // Use static width/height to ensure measurement is correct before rendering full content
          className={`
                dropdown-menu absolute rounded-2xl bg-gray-100 shadow-2xl shadow-gray-300 overflow-hidden z-2 w-full min-w-max 
                ${menuDirection.y === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'} 
                ${menuDirection.x === 'right' ? 'left-0' : 'right-0'} 
            `}
        >
          <ul
            className={`dropdown-list flex flex-col justify-start items-center max-h-48 h-fit w-full p-2 bg-gray-100 overflow-y-auto`}
          >
            <li
              onClick={() => handleSelect({ id: 0, label: "", color: "" })}
              className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 transition duration-150 ${selected.id === 0
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                } cursor-pointer`}
            >
              <p>{placeholder}</p>
            </li>
            {options.map((option) => (
              <li
                key={option.id}
                className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 transition duration-150 ${selected.id === option.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } cursor-pointer`}
                onClick={() => handleSelect(option)}
              >
                <p>{option.label}</p>
              </li>
            ))}
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