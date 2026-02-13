import type React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface CollapsibleSidebarProps {
  collapsed: boolean
  onToggle: () => void
  children: React.ReactNode
  expandedWidthClass?: string
  buttonLabel?: string
}

export default function CollapsibleSidebar({
  collapsed,
  onToggle,
  children,
  expandedWidthClass = "xl:w-[360px]",
  buttonLabel = "Collapse Panel",
}: CollapsibleSidebarProps) {
  return (
    <div className={`w-full xl:flex-none transition-all duration-300 ${collapsed ? "xl:w-[64px]" : expandedWidthClass}`}>
      <div className="mb-3">
        <button
          onClick={onToggle}
          className="w-full xl:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 hover:bg-gray-800 transition-all"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          {!collapsed && <span className="text-sm font-medium">{buttonLabel}</span>}
        </button>
      </div>
      {!collapsed && children}
    </div>
  )
}
