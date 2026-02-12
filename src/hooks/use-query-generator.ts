import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations(supabase)/client';
import { detectOperationType } from '@/lib/sql-utils';
import type { QueryHistoryItem, SchemaDefinition } from '@/lib/types';
import { schemaToString } from '@/lib/types';

type Msg = { role: 'user' | 'assistant'; content: string };

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

        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            naturalLanguage,
            schema: schema ? schemaToString(schema) : null,
            databaseType,
          }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }

        if (!resp.body) throw new Error('No response body');

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = '';
        let streamDone = false;

        while (!streamDone) {
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
            if (jsonStr === '[DONE]') {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullSQL += content;
                setGeneratedSQL(fullSQL);
              }
            } catch {
              textBuffer = line + '\n' + textBuffer;
              break;
            }
          }
        }

        // Final flush
        if (textBuffer.trim()) {
          for (let raw of textBuffer.split('\n')) {
            if (!raw) continue;
            if (raw.endsWith('\r')) raw = raw.slice(0, -1);
            if (raw.startsWith(':') || raw.trim() === '') continue;
            if (!raw.startsWith('data: ')) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullSQL += content;
                setGeneratedSQL(fullSQL);
              }
            } catch {
              /* ignore */
            }
          }
        }

        // Clean up: remove markdown code fences if present
        let cleaned = fullSQL.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:sql)?\n?/, '').replace(/\n?```$/, '');
        }
        setGeneratedSQL(cleaned);

        // Save to history
        try {
          await supabase.from('query_history').insert({
            natural_language: naturalLanguage,
            generated_sql: cleaned,
            operation_type: detectOperationType(cleaned),
            database_type: databaseType,
          });
        } catch {
          // Non-critical
        }

        setIsGenerating(false);
        return cleaned;
      } catch (e: any) {
        if (e.name === 'AbortError') return null;
        setError(e.message || 'Failed to generate SQL');
        setIsGenerating(false);
        return null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
  }, []);

  return { generatedSQL, isGenerating, error, generate, cancel, setGeneratedSQL, setError };
}
