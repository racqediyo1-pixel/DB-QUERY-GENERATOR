import { Copy, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { highlightSQL, isDestructiveQuery, detectOperationType } from '@/lib/sql-utils';
import { useToast } from '@/hooks/use-toast';

type Props = {
  sql: string;
  isStreaming: boolean;
};

export default function SQLDisplay({ sql, isStreaming }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!sql && !isStreaming) return null;

  const operationType = sql ? detectOperationType(sql) : '';
  const destructive = sql ? isDestructiveQuery(sql) : false;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const opColor: Record<string, string> = {
    SELECT: 'bg-primary/15 text-primary',
    INSERT: 'bg-success/15 text-success',
    UPDATE: 'bg-warning/15 text-warning-foreground',
    DELETE: 'bg-destructive/15 text-destructive',
    CREATE: 'bg-primary/15 text-primary',
    DROP: 'bg-destructive/15 text-destructive',
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Generated SQL</h3>
          {operationType && (
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${opColor[operationType] || 'bg-secondary text-secondary-foreground'}`}>
              {operationType}
            </span>
          )}
          {isStreaming && (
            <span className="text-[10px] font-mono text-primary animate-pulse">streaming…</span>
          )}
        </div>
        {sql && !isStreaming && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs gap-1.5">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
      </div>

      {destructive && !isStreaming && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-md bg-destructive/10 text-destructive text-xs">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>This is a destructive query. Review carefully before executing.</span>
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden border border-border bg-card">
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center px-3 gap-1.5 border-b border-border bg-secondary/50">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          <span className="ml-2 text-[10px] font-mono text-muted-foreground">query.sql</span>
        </div>
        <pre className="pt-10 pb-4 px-4 overflow-x-auto text-sm font-mono leading-relaxed min-h-[80px]">
          <code
            dangerouslySetInnerHTML={{
              __html: sql ? highlightSQL(sql) + (isStreaming ? '<span class="animate-pulse text-primary">▊</span>' : '') : '<span class="text-muted-foreground">Waiting for query…</span>',
            }}
          />
        </pre>
      </div>
    </div>
  );
}
