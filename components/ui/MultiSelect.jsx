"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PREDEFINED_CATEGORIES = [
  "Protection sociale",
  "Lutte contre la violence",
  "Accompagnement psychologique",
  "Développement communautaire",
  "Éducation et formation",
  "Santé et bien-être",
  "Économique et entrepreneuriat",
  "Environnement et durabilité",
  "Droits humains",
  "Culture et loisirs",
  "Sport et recreation",
  "Technologie et innovation"
];

export default function MultiSelect({
  options = PREDEFINED_CATEGORIES,
  value = [],
  onChange,
  placeholder = "Select categories...",
  allowCustom = true,
  maxSelected = 10,
  className = "",
  isDarkMode = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customInput, setCustomInput] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (value.includes(option)) {
      onChange(value.filter(item => item !== option));
    } else if (value.length < maxSelected) {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option) => {
    onChange(value.filter(item => item !== option));
  };

  const handleAddCustom = () => {
    if (customInput.trim() && !value.includes(customInput.trim()) && value.length < maxSelected) {
      onChange([...value, customInput.trim()]);
      setCustomInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customInput.trim()) {
        handleAddCustom();
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Items Display */}
      <div 
        className={`min-h-[42px] w-full px-3 py-2 border rounded-md cursor-pointer flex flex-wrap gap-1 items-center ${
          isDarkMode 
            ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
            : 'bg-white border-slate-300 hover:border-slate-400'
        } transition-colors duration-200`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {placeholder}
          </span>
        ) : (
          <>
            {value.map((item, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                  isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className={`ml-1 hover:bg-opacity-80 rounded-full p-0.5 ${
                    isDarkMode ? 'hover:bg-slate-500' : 'hover:bg-blue-200'
                  }`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </>
        )}
        <ChevronDown 
          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 border rounded-md shadow-lg ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-slate-300'
        }`}>
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-slate-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchRef}
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                    : ''
                }`}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className={`p-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                No categories found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-opacity-80 transition-colors duration-150 flex items-center justify-between ${
                    value.includes(option)
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'hover:bg-slate-700 text-white'
                        : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <span>{option}</span>
                  {value.includes(option) && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Custom Category Input */}
          {allowCustom && (
            <div className={`p-3 border-t border-gray-200 dark:border-slate-600`}>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom category..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`flex-1 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                      : ''
                  }`}
                />
                <Button
                  type="button"
                  onClick={handleAddCustom}
                  disabled={!customInput.trim() || value.includes(customInput.trim()) || value.length >= maxSelected}
                  size="sm"
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Press Enter or click + to add. Max {maxSelected} categories.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selection Counter */}
      {value.length > 0 && (
        <div className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          {value.length} / {maxSelected} categories selected
        </div>
      )}
    </div>
  );
}