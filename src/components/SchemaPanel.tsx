import { ChevronDown, ChevronRight, Table2 } from 'lucide-react';
import { useState } from 'react';
import type { SchemaDefinition } from '@/lib/types';

type Props = {
  schema: SchemaDefinition;
};

export default function SchemaPanel({ schema }: Props) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="px-3 py-2 bg-secondary/50 border-b border-border">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Table2 className="h-3 w-3" />
          Schema Explorer
        </h4>
      </div>
      <div className="p-1.5 space-y-0.5 max-h-[300px] overflow-y-auto">
        {schema.tables.map((table) => {
          const open = expandedTables.has(table.name);
          return (
            <div key={table.name}>
              <button
                onClick={() => toggle(table.name)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {open ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="font-mono font-semibold text-primary">{table.name}</span>
              </button>
              {open && (
                <div className="ml-6 space-y-0.5 pb-1">
                  {table.columns.map((col) => (
                    <div key={col.name} className="flex items-center gap-2 px-2 py-0.5 text-[11px]">
                      <span className="font-mono text-foreground">{col.name}</span>
                      <span className="font-mono text-muted-foreground text-[10px]">{col.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
