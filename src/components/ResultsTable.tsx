import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  data: Record<string, unknown>[];
  title?: string;
};

export default function ResultsTable({ data, title }: Props) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const exportCSV = () => {
    const header = columns.join(',');
    const rows = data.map((row) =>
      columns.map((col) => {
        const val = row[col];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">
          {title || 'Results'}{' '}
          <span className="text-muted-foreground font-normal">({data.length} rows)</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={exportCSV} className="h-7 text-xs gap-1.5">
          <Download className="h-3 w-3" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-secondary">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2.5 text-left font-mono text-xs font-semibold text-secondary-foreground whitespace-nowrap border-b border-border"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2 font-mono text-xs text-foreground whitespace-nowrap">
                      {row[col] === null ? (
                        <span className="text-muted-foreground italic">NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
