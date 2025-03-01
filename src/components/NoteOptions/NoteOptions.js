import React, { useState, useRef } from "react";
import { FiMoreVertical } from "react-icons/fi"; // Correct import

import useClickOutside from "./useClickOutside"; // Custom hook to close menu on outside click

const NoteOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsOpen(false)); // Close when clicking outside

  return (
    <div className="relative inline-block">
      {/* Three Dots Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <FiMoreVertical size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg"
        >
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Delete Note
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Add Label
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Add Drawing
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Make a Copy
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Show Checkboxes
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Copy to Google Docs
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Version History
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NoteOptions;
