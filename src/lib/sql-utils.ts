const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'JOIN', 'LEFT',
  'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON', 'AND', 'OR', 'NOT',
  'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'AS', 'ORDER', 'BY', 'GROUP',
  'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'COUNT',
  'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'EXISTS', 'ASC', 'DESC', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'CASCADE', 'DEFAULT', 'CHECK', 'CONSTRAINT', 'ADD', 'COLUMN',
  'TRUNCATE', 'RETURNING', 'WITH', 'RECURSIVE', 'COALESCE', 'CAST',
  'VARCHAR', 'INT', 'INTEGER', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP',
  'SERIAL', 'UUID', 'FLOAT', 'DECIMAL', 'NUMERIC', 'BIGINT', 'SMALLINT',
];

export function highlightSQL(sql: string): string {
  if (!sql) return '';

  let result = sql
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Highlight strings (single-quoted)
  result = result.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');

  // Highlight numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-number">$1</span>');

  // Highlight comments
  result = result.replace(/(--.*$)/gm, '<span class="sql-comment">$1</span>');

  // Highlight keywords (case-insensitive, whole words)
  const kwPattern = new RegExp(`\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi');
  result = result.replace(kwPattern, (match) => {
    // Don't highlight if inside a span already
    return `<span class="sql-keyword">${match.toUpperCase()}</span>`;
  });

  return result;
}

export function detectOperationType(sql: string): string {
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT')) return 'SELECT';
  if (trimmed.startsWith('INSERT')) return 'INSERT';
  if (trimmed.startsWith('UPDATE')) return 'UPDATE';
  if (trimmed.startsWith('DELETE')) return 'DELETE';
  if (trimmed.startsWith('CREATE')) return 'CREATE';
  if (trimmed.startsWith('DROP')) return 'DROP';
  if (trimmed.startsWith('ALTER')) return 'ALTER';
  if (trimmed.startsWith('TRUNCATE')) return 'TRUNCATE';
  return 'UNKNOWN';
}

export function isDestructiveQuery(sql: string): boolean {
  const type = detectOperationType(sql);
  return ['DELETE', 'DROP', 'TRUNCATE', 'UPDATE'].includes(type);
}
