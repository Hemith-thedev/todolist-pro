import { useState } from "react";
import { DropdownOptions, DropdownOptionOptions } from "../../data/Types";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ placeholder, options, onSelect }: DropdownOptions) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<DropdownOptionOptions>({
    id: 0,
    label: "",
    color: "",
  });
  const handleSelect = (option: DropdownOptionOptions) => {
    setSelected(option);
    onSelect(option);
  };
  return (
    <div className="dropdown relative flex flex-col justify-start items-center h-fit w-fit">
      <button
        type="button"
        className={`dropdown-button button flex justify-center items-center gap-3 p-6 rounded-2xl text-nowrap cursor-pointer hover:bg-gray-900 hover:text-white ${
          isOpen
            ? "shadow-2xl shadow-amber-600/100 bg-gray-900 text-white"
            : "shadow-xl shadow-amber-600/10 bg-gray-100 text-gray-900"
        } z-10`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{selected.label !== "" ? selected.label : placeholder}</p>
        <div
          className="icon"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown />
        </div>
      </button>
      {isOpen && (
        <div className={`dropdown-menu absolute ${
              isOpen ? "top-20" : "top-16"
            } rounded-2xl bg-gray-100 shadow-2xl shadow-gray-300 overflow-hidden z-20`}>
          <ul
            className={`dropdown-menu flex flex-col justify-start items-center max-h-48 h-fit w-fit rounded-2xl p-6 bg-gray-100 shadow-2xl shadow-gray-300 overflow-auto z-2`}
          >
            <li
              onClick={() => handleSelect({ id: 0, label: "", color: "" })}
              className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 ${
                selected.id === 0
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900"
              } cursor-pointer`}
            >
              <p>{placeholder}</p>
            </li>
            {options.map((option, index) => (
              <li
                key={index}
                className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 ${
                  selected.id === option.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900"
                } cursor-pointer`}
                onClick={() => handleSelect(option)}
              >
                <p>{option.label}</p>
              </li>
            ))}
            {window.location.pathname !== "/categories" && (
              <li
                onClick={() => navigate("/categories")}
                className="flex justify-center items-center h-fit w-full rounded-md px-5 py-2 text-nowrap bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
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
