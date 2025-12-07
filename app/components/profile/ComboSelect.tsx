import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface GroupedOptions {
  [category: string]: string[];
}

interface SelectedItem {
  option: string;
  category: string;
}

interface GroupedMultiComboSelectProps {
  options: GroupedOptions; // Object with categories as keys and arrays of options as values
  placeholder?: string; // Placeholder for the input
  onChange: (selected: SelectedItem[]) => void; // Callback when selection changes
  value: SelectedItem[]; // Controlled value for selected items
}

const GroupedMultiComboSelect: React.FC<GroupedMultiComboSelectProps> = ({ 
  options, 
  placeholder = 'Search...', 
  onChange,
  value 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<GroupedOptions>(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);

    const newFiltered: GroupedOptions = {};
    Object.entries(options).forEach(([category, opts]) => {
      const filteredOpts = opts.filter(opt => opt.toLowerCase().includes(term));
      if (filteredOpts.length > 0) {
        newFiltered[category] = filteredOpts;
      }
    });

    setFilteredOptions(newFiltered);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string, category: string) => {
    const isSelected = value.some(sel => sel.option === option && sel.category === category);
    let newSelected: SelectedItem[];
    if (isSelected) {
      newSelected = value.filter(sel => !(sel.option === option && sel.category === category));
    } else {
      newSelected = [...value, { option, category }];
    }
    onChange(newSelected);
    setSearchTerm(''); // Clear search after select for better UX
    setFilteredOptions(options); // Reset filtered to full options
    if (inputRef.current) {
      inputRef.current.focus(); // Keep focus on input without triggering scroll
    }
  };

  const handleRemoveSelected = (option: string, category: string) => {
    const newSelected = value.filter(sel => !(sel.option === option && sel.category === category));
    onChange(newSelected);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const hasOptions = Object.keys(filteredOptions).length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex flex-wrap items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        {value.map((sel, index) => (
          <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-1 px-2 py-1 rounded-full">
            {sel.option}
            <button
              type="button"
              onClick={() => handleRemoveSelected(sel.option, sel.category)}
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-grow outline-none bg-transparent"
          onFocus={handleFocus}
        />
      </div>
      {isOpen && hasOptions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {Object.entries(filteredOptions).map(([category, opts]) => (
            <li key={category}>
              <div className="px-4 py-1 text-sm font-semibold text-gray-600 bg-gray-100 sticky top-0">{category}</div>
              <ul>
                {opts.map((option, index) => {
                  const isSelected = value.some(sel => sel.option === option && sel.category === category);
                  return (
                    <li
                      key={index}
                      onClick={() => handleOptionClick(option, category)}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${isSelected ? 'bg-blue-200' : ''}`}
                    >
                      {option}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {isOpen && !hasOptions && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-4 text-gray-500">
          No options found
        </div>
      )}
    </div>
  );
};

export default GroupedMultiComboSelect;