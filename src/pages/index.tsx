import { useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import QueryInput from '@/components/QueryInput';
import SQLDisplay from '@/components/SQLDisplay';
import ResultsTable from '@/components/ResultsTable';
import SchemaPanel from '@/components/SchemaPanel';
import { useQueryGenerator } from '@/hooks/use-query-generator';
import { useQueryHistory } from '@/hooks/use-query-history';
import { useToast } from '@/hooks/use-toast';
import { DEMO_SCHEMA } from '@/lib/types';
import type { DatabaseType, QueryHistoryItem } from '@/lib/types';

// Demo results for simulated execution
const DEMO_RESULTS: Record<string, unknown>[] = [
  { id: 1, name: 'Ravi Kumar', department: 'Engineering', salary: 72000, email: 'ravi@example.com' },
  { id: 2, name: 'Priya Shah', department: 'Engineering', salary: 68000, email: 'priya@example.com' },
  { id: 3, name: 'Amit Patel', department: 'Marketing', salary: 61000, email: 'amit@example.com' },
  { id: 4, name: 'Sara Khan', department: 'HR', salary: 55000, email: 'sara@example.com' },
  { id: 5, name: 'Vikram Singh', department: 'Engineering', salary: 85000, email: 'vikram@example.com' },
];

function Index() {
  const [databaseType, setDatabaseType] = useState<DatabaseType>('postgresql');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  const [executionInfo, setExecutionInfo] = useState<string | null>(null);

  const { generatedSQL, isGenerating, error, generate, cancel, setGeneratedSQL, setError } =
    useQueryGenerator();
  const { history, isLoading: historyLoading, fetchHistory, clearHistory } = useQueryHistory();
  const { toast } = useToast();

  const handleGenerate = useCallback(
    async (text: string) => {
      setResults(null);
      setExecutionInfo(null);
      const sql = await generate(text, DEMO_SCHEMA, databaseType);
      if (sql) {
        fetchHistory();
        toast({ title: 'SQL generated successfully' });
      }
    },
    [generate, databaseType, fetchHistory, toast]
  );

  const handleExecute = useCallback(() => {
    if (!generatedSQL) return;
    // Simulate execution with demo data
    const op = generatedSQL.trim().toUpperCase();
    if (op.startsWith('SELECT')) {
      setResults(DEMO_RESULTS);
      setExecutionInfo(`Query executed — ${DEMO_RESULTS.length} rows returned`);
    } else if (op.startsWith('INSERT')) {
      setResults(null);
      setExecutionInfo('1 row inserted successfully');
    } else if (op.startsWith('UPDATE')) {
      setResults(null);
      setExecutionInfo('3 rows updated successfully');
    } else if (op.startsWith('DELETE')) {
      setResults(null);
      setExecutionInfo('2 rows deleted successfully');
    } else {
      setExecutionInfo('Query executed successfully');
    }
    toast({ title: 'Query executed (demo mode)' });
  }, [generatedSQL, toast]);

  const handleHistorySelect = useCallback(
    (item: QueryHistoryItem) => {
      setGeneratedSQL(item.generated_sql);
      setResults(null);
      setExecutionInfo(null);
      setSidebarOpen(false);
    },
    [setGeneratedSQL]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          history={history}
          isLoading={historyLoading}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
          databaseType={databaseType}
          onDatabaseChange={setDatabaseType}
        />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 lg:px-8 py-4 border-b border-border bg-card/50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Natural Language → SQL</h1>
            <p className="text-xs text-muted-foreground">
              Describe what you need and get instant SQL queries
            </p>
          </div>
          {generatedSQL && !isGenerating && (
            <button
              onClick={handleExecute}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity glow-primary-sm"
            >
              Execute (Demo)
            </button>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-6">
            {/* Input */}
            <QueryInput
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              onCancel={cancel}
            />

            {/* Error */}
            {error && (
              <div className="animate-slide-up rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* SQL Output */}
            <SQLDisplay sql={generatedSQL} isStreaming={isGenerating} />

            {/* Execution Info */}
            {executionInfo && (
              <div className="animate-slide-up rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-sm text-success flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                {executionInfo}
              </div>
            )}

            {/* Results */}
            {results && <ResultsTable data={results} />}

            {/* Schema */}
            <SchemaPanel schema={DEMO_SCHEMA} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
