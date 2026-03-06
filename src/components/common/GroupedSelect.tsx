
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";

interface GroupedSelectProps {
  groupedOptions: Record<string, string[]>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function GroupedSelect({
  groupedOptions,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  className = "",
}: GroupedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const firstGroup = Object.keys(groupedOptions)[0];
      // if (firstGroup) {
      //   setExpandedGroups(new Set([firstGroup]));
      // }
    }
  }, [isOpen, groupedOptions]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setQuery("");
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupLabel)) {
        newSet.delete(groupLabel);
      } else {
        newSet.add(groupLabel);
      }
      return newSet;
    });
  };

  const filteredGroups = Object.entries(groupedOptions).reduce((acc, [groupLabel, options]) => {
    const matchedOptions = options.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedOptions.length > 0) {
      acc[groupLabel] = matchedOptions;
    }
    return acc;
  }, {} as Record<string, string[]>);

  const hasGroups = Object.keys(filteredGroups).length > 0;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#E5E2DA] bg-white transition-all cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed bg-[#F9F8F5]" : "hover:border-[#9E9893] focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-400"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">
          {value ? (
            <span className="text-stone-900 text-[13px] font-medium">{value}</span>
          ) : (
            <span className="text-[#9E9893] text-[13px]">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <button
              onClick={clearSelection}
              className="p-1 rounded-full hover:bg-stone-100 text-[#9E9893] hover:text-stone-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#9E9893] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full bottom-full mb-2 bg-white rounded-xl border border-[#E5E2DA] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-2 border-b border-[#E5E2DA] bg-[#F9F8F5]/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893]" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E2DA] rounded-lg text-[13px] text-stone-900 placeholder-[#9E9893] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                placeholder="Search options..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {!hasGroups ? (
              <div className="py-8 px-4 text-center">
                <p className="text-[#9E9893] text-[13px]">No options found</p>
              </div>
            ) : (
              Object.entries(filteredGroups).map(([groupLabel, options]) => {
                const isExpanded = expandedGroups.has(groupLabel) || query.length > 0;
                return (
                  <div key={groupLabel} className="pb-1">
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-4 py-2 mt-1 first:mt-0 hover:bg-[#F9F8F5] transition-colors"
                      onClick={() => toggleGroup(groupLabel)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-violet-500" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-violet-500" />
                      )}
                      <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2 py-0.5 rounded-md">
                        {groupLabel.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-[#9E9893] ml-auto">
                        {options.length}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="space-y-0.5 mt-1">
                        {options.map((option) => (
                          <button
                            key={option}
                            className={`w-full capitalize text-left px-5 pl-9 py-1 text-[13px] transition-colors ${
                              value === option
                                ? "bg-violet-50 text-violet-700 font-semibold border-l-2 border-violet-500"
                                : "text-stone-600 hover:bg-[#F9F8F5] hover:text-stone-900"
                            }`}
                            onClick={() => handleSelect(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
