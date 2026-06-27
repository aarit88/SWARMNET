import React from "react";
import { Panel } from "./Panel";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  barWidth?: number | null;
  barClass?: string;
}

export function StatCard({ label, value, unit, icon, color = "var(--text-primary)", barWidth, barClass = "sn-bar-fill" }: StatCardProps) {
  return (
    <Panel variant="intel" className="p-4 flex flex-col min-h-[96px]">
      <div className="flex items-center justify-between mb-2">
        <span className="sn-label">{label}</span>
        {icon && <span style={{ color: "var(--text-muted)" }}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-mono font-bold" style={{ color, letterSpacing: "-0.02em" }}>
          {value}
        </span>
        {unit && <span className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>{unit}</span>}
      </div>
      {barWidth !== null && barWidth !== undefined ? (
        <div className="sn-bar-track mt-auto">
          <div className={barClass} style={{ width: `${barWidth}%` }} />
        </div>
      ) : (
        <div className="mt-auto" style={{ height: 2, background: "var(--border-base)", borderRadius: 1 }} />
      )}
    </Panel>
  );
}
