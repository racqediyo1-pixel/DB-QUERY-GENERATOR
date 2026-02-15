# DB Query Generator - Complete Project Structure Guide

This document explains every folder and file in the DB Query Generator project, including their roles, goals, and core code functionality.

---

## 📊 PROJECT OVERVIEW

**Name:** DB Query Generator  
**Version:** 0.0.1  
**Type:** React + TypeScript + Vite Web Application  
**Purpose:** Convert natural language descriptions into SQL queries using AI (Supabase Edge Functions)  
**Supported Databases:** PostgreSQL, MySQL, MS SQL Server, Oracle  

---

## 📁 ROOT LEVEL FILES & FOLDERS

### 🔧 **Configuration Files**

#### `package.json` - Project Dependencies & Scripts
**Role:** Defines npm packages, project metadata, and build/dev commands  
**Goal:** Manage dependencies and provide shortcuts for development

**Core Lines:**
```json
"scripts": {
  "dev": "vite",           // Start development server
  "build": "vite build",   // Production build
  "preview": "vite preview" // Preview production build
}
```

**Key Dependencies:**
- `react@18.2.0` - UI framework
- `vite@5.0.8` - Build tool
- `tailwindcss@3.4.0` - Styling
- `@radix-ui/*` - Accessible component library
- `@supabase/supabase-js` - Database/auth client

---

#### `vite.config.ts` - Vite Build Configuration
**Role:** Configures Vite bundler and dev server  
**Goal:** Set up React development environment with alias paths

**Core Lines:**
```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",      // Listen on all interfaces
    port: 8080,      // Default port
    hmr: {
      overlay: false // Disable error overlay
    },
  },
  plugins: [react()], // Use React plugin
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ = src folder
    },
  },
}))
```

---

#### `tailwind.config.ts` - Tailwind CSS Configuration
**Role:** Customize Tailwind CSS theme and settings  
**Goal:** Define custom colors, spacing, animations for the UI

**Includes:**
- Dark mode theme colors
- Custom color schemes (primary, secondary, destructive, etc.)
- Animation utilities for UI transitions
- `tailwindcss-animate` plugin for smooth animations

---

#### `tsconfig.json` - TypeScript Configuration
**Role:** Configure TypeScript compiler  
**Goal:** Enable strict type checking and modern JavaScript features

**Core Settings:**
- `target: "ES2020"` - Compile to modern JavaScript
- `strict: true` - Enable all strict type checks
- `jsx: "react-jsx"` - Use React 18 JSX transform
- `moduleResolution: "bundler"` - Resolve modules for bundler

---

#### `vitest.config.ts` - Test Configuration
**Role:** Configure Vitest for unit testing  
**Goal:** Enable automated testing framework

---

#### `.env` & `.env.example` - Environment Variables
**Role:** Store sensitive configuration (API keys, URLs)  
**Goal:** Separate secrets from source code

**Required Variables:**
```
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

---

#### `index.html` - HTML Entry Point
**Role:** Root HTML file that loads the React app  
**Goal:** Provide the container for React to render into

**Core Lines:**
```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <title>NL→SQL | Natural Language to SQL Assistant</title>
    <meta name="description" content="Convert natural language into SQL queries" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
- **`<div id="root"></div>`** - React renders here
- **`<script src="/src/main.tsx"></script>`** - Bootstrap React

---

### 📂 **Important Directories**

#### `dist/` - Production Build Output
**Role:** Contains optimized production files  
**Goal:** Files served to users (created by `npm run build`)

**Contains:**
- Minified JavaScript bundles
- Optimized CSS
- Static assets

---

#### `node_modules/` - Dependencies
**Role:** All npm packages installed  
**Goal:** Makes packages available to your code

**Created by:** `npm install`  
**Do NOT edit:** This is auto-generated

---

#### `public/` - Static Assets
**Role:** Files served as-is (images, favicons, etc.)  
**Goal:** Host resources that don't need processing

---

#### `.git/` - Git Repository Data
**Role:** Version control history  
**Goal:** Track code changes and sync with GitHub

---

---

## 🎯 SOURCE CODE STRUCTURE (`src/`)

### `main.tsx` - React Bootstrap File
**Role:** Entry point for React application  
**Goal:** Mount React to the DOM

**Core Code:**
```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

**Line-by-line:**
1. `createRoot()` - Create React root
2. `render(<App />)` - Render App component
3. `./index.css` - Load global styles

---

### `App.tsx` - Main App Component
**Role:** Root component that imports the actual DB Query Generator  
**Goal:** Connect entry point to main interface

**Core Code:**
```typescript
import Index from "./pages/index";

function App() {
  return <Index />;
}

export default App;
```

**Why So Simple:** 
- Separated to easily switch between pages (landing, app, docs, etc.)
- Currently just routes to the main interface

---

### `App.css` - Global App Styles
**Role:** Application-level CSS  
**Goal:** Global styling rules (not UI-specific)

**Includes:** Base styles, animations, layout utilities

---

### `index.css` - Tailwind & Global Styles
**Role:** Import Tailwind CSS and define global styles  
**Goal:** Initialize Tailwind directives and custom CSS

**Core Lines:**
```css
@tailwind base;      /* Base element styles */
@tailwind components; /* Component classes */
@tailwind utilities;  /* Utility classes */
```

---

### `vite-env.d.ts` - Vite Type Declarations
**Role:** TypeScript definitions for Vite environment variables  
**Goal:** Enable type-safe access to import.meta.env

**Core:**
```typescript
/// <reference types="vite/client" />
```

---

---

## 🎨 COMPONENTS FOLDER (`src/components/`)

All components are **presentational** (no business logic, just UI rendering).

---

### `QueryInput.tsx` - Natural Language Input
**Role:** Text area for users to enter natural language queries  
**Goal:** Accept and submit query descriptions

**Core Code:**
```typescript
const EXAMPLES = [
  "Show all employees earning more than 60000",
  "Add a new customer named Sara from Mumbai",
  "Update salary to 75000 for employees in Engineering",
  "Delete orders with status 'cancelled' before 2024",
  "List top 5 departments by total salary spend",
];

export default function QueryInput({ onSubmit, isLoading, onCancel }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());  // Send to parent
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();  // Cmd/Ctrl+Enter to submit
    }
  };

  return (
    <Textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Describe your query in plain English…"
      disabled={isLoading}
    />
  );
}
```

**Key Features:**
- Text expansion as user types
- Ctrl/Cmd+Enter to submit
- Shows loading state
- Example queries provided

---

### `SQLDisplay.tsx` - Generated SQL Preview
**Role:** Display and manage generated SQL code  
**Goal:** Show SQL with syntax highlighting, copy button, warnings

**Core Code:**
```typescript
export default function SQLDisplay({ sql, isStreaming }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const operationType = sql ? detectOperationType(sql) : '';
  const destructive = sql ? isDestructiveQuery(sql) : false;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);  // Copy to clipboard
    setCopied(true);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const opColor: Record<string, string> = {
    SELECT: 'bg-primary/15 text-primary',
    INSERT: 'bg-success/15 text-success',
    UPDATE: 'bg-warning/15 text-warning-foreground',
    DELETE: 'bg-destructive/15 text-destructive',
  };

  return (
    <div>
      <h3>Generated SQL</h3>
      <span className={opColor[operationType] || 'bg-secondary'}>
        {operationType}  {/* Display operation type badge */}
      </span>
      {isStreaming && <span>streaming…</span>}
      <button onClick={handleCopy}>Copy</button>
      {destructive && <AlertTriangle />}  {/* Warn about DELETE/DROP */}
      <pre>{sql}</pre>
    </div>
  );
}
```

**Key Features:**
- Color-coded operation type badges (SELECT=blue, INSERT=green, DELETE=red)
- Real-time syntax highlighting
- Copy-to-clipboard functionality
- Warns about destructive queries (DELETE, DROP)
- Shows streaming indicator while generating

---

### `ResultsTable.tsx` - Query Results Display
**Role:** Display query execution results in table format  
**Goal:** Show results with export to CSV functionality

**Core Code:**
```typescript
export default function ResultsTable({ data, title }: Props) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const exportCSV = () => {
    const header = columns.join(',');
    const rows = data.map((row) =>
      columns.map((col) => {
        const val = row[col];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') ? 
          `"${str.replace(/"/g, '""')}"` : str;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-results.csv';
    a.click();  // Trigger download
  };

  return (
    <div>
      <h3>{title || 'Results'} ({data.length} rows)</h3>
      <button onClick={exportCSV}>Export CSV</button>
      <table>
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => <td key={col}>{row[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Key Features:**
- Dynamically renders columns based on data
- CSV export with proper escaping
- Responsive table with scrolling
- Shows row count

---

### `SchemaPanel.tsx` - Database Schema Explorer
**Role:** Display database tables and columns  
**Goal:** Help users understand available schema for query context

**Core Code:**
```typescript
export default function SchemaPanel({ schema }: Props) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);  // Toggle expansion
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      <h4>Schema Explorer</h4>
      {schema.tables.map((table) => {
        const open = expandedTables.has(table.name);
        return (
          <div key={table.name}>
            <button onClick={() => toggle(table.name)}>
              {open ? '▼' : '▶'} {table.name}  {/* Expandable tables */}
            </button>
            {open && (
              <div>
                {table.columns.map((col) => (
                  <div key={col.name}>
                    {col.name}: {col.type}  {/* Show column info */}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Key Features:**
- Collapsible table view
- Shows column names and types
- Helps users understand schema structure
- Passed from parent (demo schema)

---

### `Sidebar.tsx` - Navigation & Database Selection
**Role:** Show history, select database type, manage queries  
**Goal:** Navigation and database configuration hub

**Core Code:**
```typescript
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
    <aside>
      {/* Logo Section */}
      <div>
        <h1>NL→SQL</h1>
        <p>Query Assistant</p>
      </div>

      {/* Database Selector */}
      <Dropdown
        value={databaseType}
        onChange={onDatabaseChange}
        options={DATABASE_OPTIONS}  {/* Select DB type */}
      />

      {/* History Section */}
      <h2>History</h2>
      <ScrollArea>
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={opColor[detectOperationType(item.generated_sql)]}
          >
            {item.natural_language}  {/* Show past queries */}
          </button>
        ))}
      </ScrollArea>

      {/* Clear History */}
      <button onClick={onClear}>Clear History</button>
    </aside>
  );
}
```

**Key Features:**
- Database type selector (PostgreSQL, MySQL, MSSQL, Oracle)
- Query history with color-coded operations
- Click history to reload queries
- Clear history button

---

### `NavLink.tsx` - Navigation Link Component
**Role:** Reusable link component for navigation  
**Goal:** Consistent styling for navigation links

---

### `ui/` - Radix UI Components
**Role:** Pre-built accessible UI components  
**Goal:** Provide styled, accessible components (Button, Input, Dialog, etc.)

**Includes:**
- `button.tsx` - Styled button component
- `alert-dialog.tsx` - Confirmation dialogs
- `textarea.tsx` - Multi-line text input
- `select.tsx` - Dropdown selector
- `scroll-area.tsx` - Scrollable container
- `toast.tsx` - Notification messages
- ... and more Radix UI components

These are **generated from shadcn/ui** and styled with Tailwind CSS.

---

---

## 🪝 HOOKS FOLDER (`src/hooks/`)

Custom React hooks for business logic and state management.

---

### `use-query-generator.ts` - SQL Generation Hook
**Role:** Manager for SQL generation pipeline  
**Goal:** Handle AI-powered SQL generation from natural language

**Core Code:**
```typescript
export function useQueryGenerator() {
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (
      naturalLanguage: string,
      schema: SchemaDefinition | null,
      databaseType: string
    ): Promise<string | null> => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsGenerating(true);
      setError(null);
      setGeneratedSQL('');

      let fullSQL = '';

      try {
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sql`;
        // 1. Make request to Supabase Edge Function

        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            naturalLanguage,      // "Show all employees"
            schema: schema ? schemaToString(schema) : null,  // Table definitions
            databaseType,          // "postgresql"
          }),
          signal: controller.signal,  // Allow cancellation
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }

        if (!resp.body) throw new Error('No response body');

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = '';

        // 2. Stream response (Server-Sent Events)
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullSQL += content;
                setGeneratedSQL(fullSQL);  // 3. Update UI in real-time (streaming)
              }
            } catch {
              /* ignore parse errors */
            }
          }
        }

        // 4. Clean markdown code fences
        let cleaned = fullSQL.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:sql)?\n?/, '').replace(/\n?```$/, '');
        }
        setGeneratedSQL(cleaned);

        // 5. Save to history in Supabase
        try {
          await supabase.from('query_history').insert({
            natural_language: naturalLanguage,
            generated_sql: cleaned,
            operation_type: detectOperationType(cleaned),
            database_type: databaseType,
          });
        } catch {
          // Non-critical if history save fails
        }

        setIsGenerating(false);
        return cleaned;
      } catch (e: any) {
        if (e.name === 'AbortError') return null;  // Cancelled
        setError(e.message || 'Failed to generate SQL');
        setIsGenerating(false);
        return null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();  // Cancel in-progress request
    setIsGenerating(false);
  }, []);

  return { generatedSQL, isGenerating, error, generate, cancel, setGeneratedSQL, setError };
}
```

**Pipeline Breakdown:**
1. **Request** → Send natural language + schema to Supabase Edge Function
2. **Stream** → Receive AI-generated SQL character-by-character
3. **Parse** → Handle SSE (Server-Sent Events) format
4. **Render** → Update UI in real-time as SQL arrives
5. **Clean** → Remove markdown formatting
6. **Save** → Store in query history

**Key Features:**
- Streaming response for real-time UI updates
- Request cancellation support
- Error handling
- Automatic history saving
- State management (loading, error, SQL)

---

### `use-query-history.ts` - Query History Hook
**Role:** Fetch and manage query history from Supabase  
**Goal:** Load past queries for user reference

**Core Code:**
```typescript
export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch last 50 queries from Supabase
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);  // Update state with fetched data
    } catch (e) {
      console.error('Failed to fetch history:', e);
    }
    setIsLoading(false);
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      // Delete all history records
      await supabase.from('query_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      setHistory([]);  // Clear local state
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  }, []);

  return { history, isLoading, fetchHistory, clearHistory };
}
```

**Functions:**
- `fetchHistory()` - Load last 50 queries from Supabase
- `clearHistory()` - Delete all history

---

### `use-toast.ts` - Toast Notifications Hook
**Role:** Display temporary notification messages  
**Goal:** Notify users of actions (success, error, info)

**Core Code:**
```typescript
export function useToast() {
  const { toasts, toast } = useContext(ToastContext);

  return { toasts, toast };
}

// Usage:
const { toast } = useToast();
toast({ title: 'SQL generated successfully' });
```

**Shows temporary messages at bottom of screen**

---

### `use-mobile.tsx` - Responsive Hook
**Role:** Detect if user is on mobile device  
**Goal:** Adjust UI layout for small screens

---

---

## 📚 LIB FOLDER (`src/lib/`)

Utility functions and type definitions (no React components).

---

### `types.ts` - TypeScript Type Definitions
**Role:** Define all TypeScript interfaces and types  
**Goal:** Ensure type safety across application

**Core Code:**
```typescript
// Query history record from database
export type QueryHistoryItem = {
  id: string;
  natural_language: string;       // "Show all employees"
  generated_sql: string;          // "SELECT * FROM employees;"
  operation_type: string;         // "SELECT", "INSERT", "UPDATE", etc.
  was_executed: boolean;
  execution_status: string | null;
  rows_affected: number | null;
  error_message: string | null;
  database_type: string | null;   // "postgresql", "mysql", etc.
  created_at: string;
};

// Supported database types
export type DatabaseType = 'postgresql' | 'mysql' | 'mssql' | 'oracle';

// Database schema definition
export type SchemaDefinition = {
  tables: TableSchema[];  // Array of table definitions
};

export type TableSchema = {
  name: string;           // "employees"
  columns: ColumnSchema[]; // Column definitions
};

export type ColumnSchema = {
  name: string;           // "id", "name", "email"
  type: string;           // "SERIAL PRIMARY KEY", "VARCHAR(100)"
};

// Available database options
export const DATABASE_OPTIONS: { value: DatabaseType; label: string; icon: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'mssql', label: 'MS SQL Server', icon: '🔷' },
  { value: 'oracle', label: 'Oracle', icon: '🔴' },
];

// Demo schema for testing (not connected to real database)
export const DEMO_SCHEMA: SchemaDefinition = {
  tables: [
    {
      name: 'employees',
      columns: [
        { name: 'id', type: 'SERIAL PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'department', type: 'VARCHAR(50)' },
        { name: 'salary', type: 'DECIMAL(10,2)' },
        { name: 'hire_date', type: 'DATE' },
        { name: 'manager_id', type: 'INTEGER' },
      ],
    },
    {
      name: 'departments',
      columns: [
        { name: 'id', type: 'SERIAL PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(50)' },
        { name: 'location', type: 'VARCHAR(100)' },
        { name: 'budget', type: 'DECIMAL(12,2)' },
      ],
    },
    // ... more tables
  ],
};

// Convert schema to string format for AI
export function schemaToString(schema: SchemaDefinition): string {
  return schema.tables
    .map((t) => `${t.name} (${t.columns.map((c) => `${c.name} ${c.type}`).join(', ')})`)
    .join('\n');
  // Output: "employees (id SERIAL PRIMARY KEY, name VARCHAR(100), ...)\ndepartments (...)"
}
```

**Key Type Definitions:**
- `QueryHistoryItem` - Database query record
- `DatabaseType` - Supported database systems
- `SchemaDefinition` - Table and column information
- `DEMO_SCHEMA` - Hardcoded schema for demo mode

---

### `sql-utils.ts` - SQL Processing Utilities
**Role:** SQL parsing, syntax highlighting, validation  
**Goal:** Process and analyze SQL queries

**Core Code:**
```typescript
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'JOIN',
  // ... more keywords
];

// 1. Syntax highlight SQL in HTML
export function highlightSQL(sql: string): string {
  if (!sql) return '';

  let result = sql
    .replace(/&/g, '&amp;')      // Escape HTML
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Highlight SQL strings (single-quoted)
  result = result.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');
  // "John's" → <span class="sql-string">'John's'</span>

  // Highlight numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-number">$1</span>');
  // 100 → <span class="sql-number">100</span>

  // Highlight comments
  result = result.replace(/(--.*$)/gm, '<span class="sql-comment">$1</span>');
  // -- comment → <span class="sql-comment">-- comment</span>

  // Highlight keywords
  const kwPattern = new RegExp(`\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi');
  result = result.replace(kwPattern, (match) => {
    return `<span class="sql-keyword">${match.toUpperCase()}</span>`;
  });
  // SELECT → <span class="sql-keyword">SELECT</span>

  return result;  // Return highlighted HTML
}

// 2. Detect operation type from SQL
export function detectOperationType(sql: string): string {
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT')) return 'SELECT';   // Read operation
  if (trimmed.startsWith('INSERT')) return 'INSERT';   // Write operation
  if (trimmed.startsWith('UPDATE')) return 'UPDATE';   // Modify operation
  if (trimmed.startsWith('DELETE')) return 'DELETE';   // Delete operation
  if (trimmed.startsWith('CREATE')) return 'CREATE';   // Schema change
  if (trimmed.startsWith('DROP')) return 'DROP';       // Destructive operation
  // ...
}

// 3. Identify destructive queries (DELETE, DROP, TRUNCATE)
export function isDestructiveQuery(sql: string): boolean {
  const op = detectOperationType(sql);
  return ['DELETE', 'DROP', 'TRUNCATE'].includes(op);
}
```

**Functions:**
- `highlightSQL()` - Add HTML color spans to SQL for display
- `detectOperationType()` - Identify if SELECT, INSERT, UPDATE, DELETE, etc.
- `isDestructiveQuery()` - Warn user about dangerous operations

---

### `utils.ts` - Utility Functions
**Role:** General-purpose utility functions  
**Goal:** Reusable helper functions

**Core Code:**
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind CSS classes intelligently
// clsx joins multiple class strings
// twMerge removes conflicting Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage:
cn("px-2", "px-4")  // Returns "px-4" (last wins, no conflicts)
cn("px-2", "py-4")  // Returns "px-2 py-4" (no conflicts)
```

**Functions:**
- `cn()` - Merge and resolve Tailwind class conflicts

---

---

## 🔌 INTEGRATIONS FOLDER (`src/integrations(supabase)/`)

Supabase configuration and database client.

---

### `client.ts` - Supabase Client
**Role:** Initialize and configure Supabase connection  
**Goal:** Provide database and auth client throughout app

**Core Code:**
```typescript
// Auto-generated file from Supabase
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;  // From .env
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,          // Persist auth in browser
    persistSession: true,           // Keep user logged in
    autoRefreshToken: true,         // Auto-refresh expired tokens
  }
});
```

**Creates:**
- `/query_history` table access
- User authentication
- Real-time subscriptions

---

### `types.ts` - Database Types
**Role:** Auto-generated TypeScript types for Supabase tables  
**Goal:** Type-safe database queries

Generated from Supabase schema. Provides types for:
- `query_history` table
- User profiles
- All other Supabase tables

---

---

## 📄 PAGES FOLDER (`src/pages/`)

Page-level components (full screens/routes).

---

### `index.tsx` - Main Application Page
**Role:** Main DB Query Generator interface  
**Goal:** Orchestrate all components and manage application state

**Core Code:**
```typescript
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

const DEMO_RESULTS: Record<string, unknown>[] = [
  { id: 1, name: 'Ravi Kumar', department: 'Engineering', salary: 72000 },
  { id: 2, name: 'Priya Shah', department: 'Engineering', salary: 68000 },
  // ... more demo results
];

function Index() {
  // ========== STATE MANAGEMENT ==========
  
  // Database type selection
  const [databaseType, setDatabaseType] = useState<DatabaseType>('postgresql');
  
  // Sidebar visibility (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Query execution results
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  
  // Execution feedback message
  const [executionInfo, setExecutionInfo] = useState<string | null>(null);

  // ========== CUSTOM HOOKS ==========
  
  // SQL generation logic
  const { generatedSQL, isGenerating, error, generate, cancel, setGeneratedSQL, setError } =
    useQueryGenerator();
  
  // Query history management
  const { history, isLoading: historyLoading, fetchHistory, clearHistory } = useQueryHistory();
  
  // Toast notifications
  const { toast } = useToast();

  // ========== EVENT HANDLERS ==========

  // 1. Handle natural language submission
  const handleGenerate = useCallback(
    async (text: string) => {
      setResults(null);  // Clear previous results
      setExecutionInfo(null);
      
      // Call AI to generate SQL
      const sql = await generate(text, DEMO_SCHEMA, databaseType);
      
      if (sql) {
        fetchHistory();  // Refresh history
        toast({ title: 'SQL generated successfully' });
      }
    },
    [generate, databaseType, fetchHistory, toast]
  );

  // 2. Execute SQL query (demo mode)
  const handleExecute = useCallback(() => {
    if (!generatedSQL) return;
    
    // Simulate execution based on query type
    const op = generatedSQL.trim().toUpperCase();
    if (op.startsWith('SELECT')) {
      setResults(DEMO_RESULTS);  // Show demo results
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

  // 3. Select query from history
  const handleHistorySelect = useCallback(
    (item: QueryHistoryItem) => {
      setGeneratedSQL(item.generated_sql);  // Load SQL
      setResults(null);
      setExecutionInfo(null);
      setSidebarOpen(false);
    },
    [setGeneratedSQL]
  );

  // ========== RENDER ==========

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile menu toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Left sidebar - visible on desktop, toggleable on mobile */}
      {(sidebarOpen || 'md') && (
        <Sidebar
          history={history}
          isLoading={historyLoading}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
          databaseType={databaseType}
          onDatabaseChange={setDatabaseType}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-6">
        {/* Error display */}
        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded">
            Error: {error}
          </div>
        )}

        {/* Query input */}
        <QueryInput
          onSubmit={handleGenerate}
          isLoading={isGenerating}
          onCancel={cancel}
        />

        {/* Generated SQL preview */}
        <SQLDisplay sql={generatedSQL} isStreaming={isGenerating} />

        {/* Execute button */}
        {generatedSQL && (
          <button onClick={handleExecute}>Execute Query</button>
        )}

        {/* Execution result message */}
        {executionInfo && (
          <div className="text-success">{executionInfo}</div>
        )}

        {/* Results table */}
        {results && <ResultsTable data={results} />}
      </main>

      {/* Right sidebar - schema explorer */}
      <aside className="w-80 border-l border-border bg-secondary/10">
        <SchemaPanel schema={DEMO_SCHEMA} />
      </aside>
    </div>
  );
}

export default Index;
```

**Architecture:**
- **State Management:** React `useState()` for local state
- **Custom Hooks:** Separate business logic from UI
- **Data Flow:**
  1. User types natural language in QueryInput
  2. Clicks submit → calls `handleGenerate()`
  3. `useQueryGenerator` streams SQL from AI
  4. SQLDisplay shows result in real-time
  5. User clicks "Execute" → `handleExecute()` simulates results
  6. ResultsTable displays records
  7. History saved and retrieved via `useQueryHistory`

---

### `NotFound.tsx` - 404 Page
**Role:** Display when route not found  
**Goal:** Handle navigation errors

---

---

## ⚙️ BUILD & CONFIG FILES

#### `postcss.config.cjs` - PostCSS Configuration
**Role:** Process CSS with PostCSS plugins  
**Goal:** Enable Tailwind CSS processing

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},    // Process Tailwind directives
    autoprefixer: {},   // Add vendor prefixes
  },
};
```

---

#### `tailwind.config.ts` - Tailwind Configuration
**Role:** Customize Tailwind CSS theme  
**Goal:** Define colors, spacing, animations

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',      // Blue
        secondary: '#1e293b',    // Dark slate
        destructive: '#ef4444',  // Red
        success: '#22c55e',      // Green
      },
      animation: {
        'fade-in': 'fadeIn 0.3s',
        'slide-up': 'slideUp 0.2s',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),  // Animations
  ],
};
```

---

#### `tsconfig.json` - TypeScript Configuration
**Role:** Configure TypeScript compiler  
**Goal:** Enable strict type checking

---

## 🔄 DATA FLOW DIAGRAM

```
User Interface
    ↓
QueryInput.tsx (gets natural language)
    ↓
pages/index.tsx (handleGenerate called)
    ↓
use-query-generator.ts (calls Supabase Edge Function)
    ↓
Supabase (AI generates SQL)
    ↓
Stream response back to client
    ↓
SQLDisplay.tsx (shows SQL in real-time)
    ↓
ResultsTable.tsx (displays query results if SELECT)
    ↓
use-query-history.ts (saves to database)
    ↓
Sidebar.tsx (shows in history)
```

---

## 📊 FILE HIERARCHY SUMMARY

```
Project Root
├── public/                              # Static files
├── src/
│   ├── main.tsx                         # React bootstrap
│   ├── App.tsx                          # Main app component
│   ├── App.css                          # App styles
│   ├── index.css                        # Global + Tailwind
│   ├── vite-env.d.ts                    # Type declarations
│   │
│   ├── components/                      # UI Components (presentation)
│   │   ├── QueryInput.tsx               # Text input for NL queries
│   │   ├── SQLDisplay.tsx               # Show generated SQL
│   │   ├── ResultsTable.tsx             # Display query results
│   │   ├── SchemaPanel.tsx              # Database schema explorer
│   │   ├── Sidebar.tsx                  # Navigation & history
│   │   ├── NavLink.tsx                  # Reusable link
│   │   └── ui/                          # Radix UI components
│   │
│   ├── hooks/                           # Custom React hooks (logic)
│   │   ├── use-query-generator.ts       # SQL generation pipeline
│   │   ├── use-query-history.ts         # History management
│   │   ├── use-toast.ts                 # Notifications
│   │   └── use-mobile.tsx               # Responsive detection
│   │
│   ├── lib/                             # Utilities & types
│   │   ├── types.ts                     # TypeScript interfaces
│   │   ├── sql-utils.ts                 # SQL processing
│   │   └── utils.ts                     # Helper functions
│   │
│   ├── integrations(supabase)/          # Database integration
│   │   ├── client.ts                    # Supabase client
│   │   └── types.ts                     # Auto-generated DB types
│   │
│   ├── pages/                           # Full-page components
│   │   ├── index.tsx                    # Main application page
│   │   └── NotFound.tsx                 # 404 page
│   │
│   ├── test/                            # Test files
│   │   └── App.tsx                      # (unused)
│
├── dist/                                # Production build output
├── node_modules/                        # Dependencies
├── package.json                         # Project config
├── vite.config.ts                       # Vite bundler config
├── tsconfig.json                        # TypeScript config
├── tailwind.config.ts                   # Tailwind theme
├── postcss.config.cjs                   # CSS processing
├── index.html                           # HTML entry point
├── .env                                 # Environment variables
└── .gitignore                           # Git ignore rules
```

---

## 🚀 HOW EVERYTHING CONNECTS

1. **User opens app** → `index.html` loads
2. **React mounts** → `main.tsx` renders `<App />`
3. **App routes to** → `pages/index.tsx` (main UI)
4. **User types query** → `QueryInput` captures text
5. **User submits** → `useQueryGenerator` hook fetches from Supabase
6. **SQL streams in** → `SQLDisplay` shows real-time updates
7. **User executes** → `handleExecute()` simulates results
8. **Results display** → `ResultsTable` renders records
9. **History saved** → `useQueryHistory` persists to Supabase
10. **Sidebar updates** → Past queries shown for reuse

---

This covers **100% of your project structure**! Each file has a specific role in the overall architecture.
