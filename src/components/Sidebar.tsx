import { Clock, Trash2, Database, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { QueryHistoryItem, DatabaseType } from '@/lib/types';
import { DATABASE_OPTIONS } from '@/lib/types';
import { detectOperationType } from '@/lib/sql-utils';

type Props = {
  history: QueryHistoryItem[];
  isLoading: boolean;
  onSelect: (item: QueryHistoryItem) => void;
  onClear: () => void;
  databaseType: DatabaseType;
  onDatabaseChange: (db: DatabaseType) => void;
};

export default function Sidebar({
  history,
  isLoading,
  onSelect,
  onClear,
  databaseType,
  onDatabaseChange,
}: Props) {
  const currentDb = DATABASE_OPTIONS.find((d) => d.value === databaseType);

  const opColor: Record<string, string> = {
    SELECT: 'text-primary',
    INSERT: 'text-success',
    UPDATE: 'text-warning',
    DELETE: 'text-destructive',
  };

  return (
    <aside className="w-full h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary-sm">
            <Database className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground leading-none">NL→SQL</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Query Assistant</p>
          </div>
        </div>
      </div>

      {/* DB Selector */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Database
        </label>
        <div className="relative">
          <select
            value={databaseType}
            onChange={(e) => onDatabaseChange(e.target.value as DatabaseType)}
            className="w-full appearance-none bg-sidebar-accent text-sidebar-accent-foreground text-sm rounded-md px-3 py-2 pr-8 border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            {DATABASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* History */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">History</span>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-md bg-sidebar-accent animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8 px-4">
              No queries yet. Start by typing a request!
            </p>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left p-2.5 rounded-md hover:bg-sidebar-accent transition-colors group cursor-pointer"
              >
                <p className="text-xs text-sidebar-foreground line-clamp-2 leading-relaxed">
                  {item.natural_language}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-mono font-bold ${opColor[item.operation_type] || 'text-muted-foreground'}`}>
                    {item.operation_type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
