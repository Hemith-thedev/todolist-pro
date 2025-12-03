import { useState } from "react";
import { DropdownOptions, DropdownOptionOptions } from "../../data/Types";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const Dropdown = ({ placeholder, options, onSelect }: DropdownOptions) => {
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
        className={`dropdown-button button flex justify-center items-center gap-3 p-6 rounded-2xl text-nowrap cursor-pointer hover:bg-gray-900 hover:text-white ${(isOpen) ? "shadow-2xl shadow-amber-600/100 bg-gray-900 text-white" : "shadow-xl shadow-amber-600/10 bg-gray-100 text-gray-900"}`}
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
        <motion.ul className="dropdown-menu absolute top-20 flex flex-col justify-center items-center h-fit w-fit rounded-2xl p-6 bg-gray-100 shadow-2xl shadow-gray-300 z-2">
          <li
            onClick={() => handleSelect({ id: 0, label: "", color: "" })}
            className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 ${(selected.id === 0) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} cursor-pointer`}
          >
            <p>{placeholder}</p>
          </li>
          {options.map((option, index) => (
            <li
              key={index} 
              className={`flex justify-center items-center h-fit w-full rounded-md px-5 py-2 ${(selected.id === option.id) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} cursor-pointer`}
              onClick={() => handleSelect(option)}
            >
              <p>{option.label}</p>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Dropdown;
