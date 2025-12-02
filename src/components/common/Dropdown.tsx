import { useState } from "react";
import { DropdownOptions, DropdownOptionOptions } from "../../data/Types";

const Dropdown = ({ placeholder, options, onSelect }: DropdownOptions) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<DropdownOptionOptions>({ id: "", label: "", color: "" });
  const handleSelect = (option: DropdownOptionOptions) => {
    setSelected(option);
    onSelect(option);
  }
  return (
    <div className="dropdown">
      <button
        className="dropdown-button"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <p>{(selected.label !== "") ? selected.label : placeholder}</p>
      </button>
      {
        (isOpen) && <ul className="dropdown-menu">
          <li
            onClick={() => handleSelect({ id: "", label: "", color: "" })}
          >
            <p>{placeholder}</p>
          </li>
          {
            options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
              >
                <p style={{ color: option.color }}>{option.label}</p>
              </li>
            ))
          }
        </ul>
      }
    </div>
  )
}

export default Dropdown;