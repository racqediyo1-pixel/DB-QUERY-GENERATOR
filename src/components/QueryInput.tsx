import { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  onCancel: () => void;
};

const EXAMPLES = [
  "Show all employees earning more than 60000",
  "Add a new customer named Sara from Mumbai",
  "Update salary to 75000 for employees in Engineering",
  "Delete orders with status 'cancelled' before 2024",
  "List top 5 departments by total salary spend",
  "Find customers who placed orders in July",
];

export default function QueryInput({ onSubmit, isLoading, onCancel }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your query in plain English…"
          className="min-h-[100px] resize-none bg-card border-border font-sans text-base pr-14 focus:ring-2 focus:ring-primary/30 transition-all"
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={isLoading ? onCancel : handleSubmit}
          disabled={!input.trim() && !isLoading}
          className="absolute bottom-3 right-3 rounded-lg h-9 w-9"
          variant={isLoading ? 'destructive' : 'default'}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            onClick={() => {
              setInput(example);
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer truncate max-w-[260px]"
          >
            <Sparkles className="h-3 w-3 inline mr-1 opacity-60" />
            {example}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-[10px]">⌘ Enter</kbd> to generate
      </p>
    </div>
  );
}
