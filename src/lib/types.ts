  export type QueryHistoryItem = {
  id: string;
  natural_language: string;
  generated_sql: string;
  operation_type: string;
  was_executed: boolean;
  execution_status: string | null;
  rows_affected: number | null;
  error_message: string | null;
  database_type: string | null;
  created_at: string;
};

export type DatabaseType = 'postgresql' | 'mysql' | 'mssql' | 'oracle';

export type SchemaDefinition = {
  tables: TableSchema[];
};

export type TableSchema = {
  name: string;
  columns: ColumnSchema[];
};

export type ColumnSchema = {
  name: string;
  type: string;
};

export const DATABASE_OPTIONS: { value: DatabaseType; label: string; icon: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'mssql', label: 'MS SQL Server', icon: '🔷' },
  { value: 'oracle', label: 'Oracle', icon: '🔴' },
];

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
    {
      name: 'orders',
      columns: [
        { name: 'id', type: 'SERIAL PRIMARY KEY' },
        { name: 'customer_id', type: 'INTEGER' },
        { name: 'product', type: 'VARCHAR(200)' },
        { name: 'quantity', type: 'INTEGER' },
        { name: 'total_amount', type: 'DECIMAL(10,2)' },
        { name: 'order_date', type: 'DATE' },
        { name: 'status', type: 'VARCHAR(20)' },
      ],
    },
    {
      name: 'customers',
      columns: [
        { name: 'id', type: 'SERIAL PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'city', type: 'VARCHAR(100)' },
        { name: 'country', type: 'VARCHAR(50)' },
        { name: 'joined_date', type: 'DATE' },
      ],
    },
  ],
};

export function schemaToString(schema: SchemaDefinition): string {
  return schema.tables
    .map((t) => `${t.name} (${t.columns.map((c) => `${c.name} ${c.type}`).join(', ')})`)
    .join('\n');
}
