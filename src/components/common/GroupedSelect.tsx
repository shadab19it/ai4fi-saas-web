
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Search, X, Check } from "lucide-react";

// ─── Single-select props ────────────────────────────────────────────────────
interface SingleSelectProps {
  multiSelect?: false;
  groupedOptions: Record<string, string[]>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  // unused in single mode
  multiValue?: never;
  onMultiChange?: never;
  maxSelections?: never;
}

// ─── Multi-select props ─────────────────────────────────────────────────────
interface MultiSelectProps {
  multiSelect: true;
  groupedOptions: Record<string, string[]>;
  multiValue: string[];
  onMultiChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  // unused in multi mode
  value?: never;
  onChange?: never;
}

type GroupedSelectProps = SingleSelectProps | MultiSelectProps;

export default function GroupedSelect(props: GroupedSelectProps) {
  const {
    groupedOptions,
    placeholder = "Select option...",
    disabled = false,
    className = "",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // ── derived values ──────────────────────────────────────────────────────
  const isMulti = props.multiSelect === true;
  const selectedValues: string[] = isMulti ? (props as MultiSelectProps).multiValue : [];
  const singleValue: string = !isMulti ? (props as SingleSelectProps).value : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── handlers ────────────────────────────────────────────────────────────
  const handleSingleSelect = (option: string) => {
    if (!isMulti) {
      (props as SingleSelectProps).onChange(option);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleMultiToggle = (option: string) => {
    if (!isMulti) return;
    const mp = props as MultiSelectProps;
    const current = mp.multiValue;
    if (current.includes(option)) {
      mp.onMultiChange(current.filter((v) => v !== option));
    } else {
      const max = mp.maxSelections;
      if (max !== undefined && current.length >= max) return;
      mp.onMultiChange([...current, option]);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti) {
      (props as MultiSelectProps).onMultiChange([]);
    } else {
      (props as SingleSelectProps).onChange("");
    }
  };

  const removeTag = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    if (isMulti) {
      const mp = props as MultiSelectProps;
      mp.onMultiChange(mp.multiValue.filter((v) => v !== val));
    }
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

  // ── filtering ───────────────────────────────────────────────────────────
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

  const maxSel = isMulti ? (props as MultiSelectProps).maxSelections : undefined;
  const isMaxReached = isMulti && maxSel !== undefined && selectedValues.length >= maxSel;

  // ── trigger label ───────────────────────────────────────────────────────
  const renderTrigger = () => {
    if (isMulti) {
      if (selectedValues.length === 0) {
        return <span className="text-[#9E9893] text-[13px]">{placeholder}</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 py-0.5">
          {selectedValues.map((val) => (
            <span
              key={val}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-200 rounded-full capitalize"
            >
              {val}
              <button
                type="button"
                onClick={(e) => removeTag(e, val)}
                className="text-violet-400 hover:text-violet-700 transition-colors ml-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      );
    }
    if (singleValue) {
      return <span className="text-stone-900 text-[13px] font-medium">{singleValue}</span>;
    }
    return <span className="text-[#9E9893] text-[13px]">{placeholder}</span>;
  };

  const hasValue = isMulti ? selectedValues.length > 0 : !!singleValue;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={`flex items-start justify-between px-3.5 py-2.5 rounded-xl border border-[#E5E2DA] bg-white transition-all cursor-pointer ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-[#F9F8F5]"
            : "hover:border-[#9E9893] focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-400"
        } ${isOpen ? "ring-2 ring-violet-500/30 border-violet-400" : ""}`}
        onClick={() => {
          if (disabled) return;
          if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            // dropdown is ~280px max; open upward only when there's more room above
            setDropUp(spaceAbove > spaceBelow && spaceAbove > 280);
          }
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex-1 min-w-0 mr-2">{renderTrigger()}</div>
        <div className="flex items-center gap-1 mt-0.5 shrink-0">
          {hasValue && !disabled && (
            <button
              type="button"
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

      {/* Multi-select count badge */}
      {isMulti && selectedValues.length > 0 && (
        <div className="absolute -top-2 -right-2 z-10 bg-violet-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {selectedValues.length}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute z-[100] w-full bg-white rounded-xl border border-[#E5E2DA] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden duration-200 ${
            dropUp
              ? "bottom-full mb-2 animate-in fade-in slide-in-from-bottom-2"
              : "top-full mt-2 animate-in fade-in slide-in-from-top-2"
          }`}>
          {/* Search */}
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
            {/* Multi-select limit hint */}
            {isMulti && maxSel !== undefined && (
              <p className={`text-[11px] mt-1.5 px-1 font-medium ${isMaxReached ? "text-amber-600" : "text-[#9E9893]"}`}>
                {isMaxReached
                  ? `Max ${maxSel} poses selected`
                  : `${selectedValues.length}/${maxSel} selected`}
              </p>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {!hasGroups ? (
              <div className="py-8 px-4 text-center">
                <p className="text-[#9E9893] text-[13px]">No options found</p>
              </div>
            ) : (
              Object.entries(filteredGroups).map(([groupLabel, options]) => {
                const isExpanded = expandedGroups.has(groupLabel) || query.length > 0;
                const groupSelectedCount = isMulti
                  ? options.filter((o) => selectedValues.includes(o)).length
                  : 0;

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
                      {isMulti && groupSelectedCount > 0 && (
                        <span className="text-[10px] bg-violet-600 text-white font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                          {groupSelectedCount}
                        </span>
                      )}
                      <span className="text-[10px] text-[#9E9893] ml-auto">
                        {options.length}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="space-y-0.5 mt-1">
                        {options.map((option) => {
                          const isSelected = isMulti
                            ? selectedValues.includes(option)
                            : singleValue === option;
                          const isDisabledOption = isMulti && isMaxReached && !isSelected;

                          return (
                            <button
                              key={option}
                              type="button"
                              className={`w-full capitalize text-left px-5 pl-9 py-1.5 text-[13px] transition-colors flex items-center gap-2 ${
                                isSelected
                                  ? "bg-violet-50 text-violet-700 font-semibold border-l-2 border-violet-500"
                                  : isDisabledOption
                                  ? "text-stone-300 cursor-not-allowed"
                                  : "text-stone-600 hover:bg-[#F9F8F5] hover:text-stone-900"
                              }`}
                              onClick={() => {
                                if (isMulti) handleMultiToggle(option);
                                else handleSingleSelect(option);
                              }}
                              disabled={isDisabledOption}
                            >
                              {isMulti && (
                                <span
                                  className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-violet-600 border-violet-600"
                                      : "border-[#D4D0CB]"
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                </span>
                              )}
                              <span>{option}</span>
                            </button>
                          );
                        })}
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
