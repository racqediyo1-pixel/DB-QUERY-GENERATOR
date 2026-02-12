import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations(supabase)/client';
import type { QueryHistoryItem } from '@/lib/types';

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('query_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setHistory(data as QueryHistoryItem[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const clearHistory = useCallback(async () => {
    await supabase.from('query_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setHistory([]);
  }, []);

  return { history, isLoading, fetchHistory, clearHistory };
}