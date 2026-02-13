import type React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Button from "../../ui/Button"

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
        <Button
          variant="outline"
          size="md"
          onClick={onToggle}
          icon={collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          className="w-full xl:w-auto"
        >
          {!collapsed && buttonLabel}
        </Button>
      </div>
      {!collapsed && children}
    </div>
  )
}
