import { describe, expect, it } from 'vitest';
import type { JournalEntry } from '../types/wellness';
import { buildJournalCsv, filterEntriesByPeriod } from './journalExport';

function entry(id: string, content: string, createdAt: string): JournalEntry {
  return { id, content, mood: 'good', createdAt };
}

describe('filterEntriesByPeriod', () => {
  const entries = [
    entry('3', 'terceira', '2026-09-23T10:00:00.000Z'),
    entry('2', 'segunda', '2026-09-10T10:00:00.000Z'),
    entry('1', 'primeira', '2026-08-01T10:00:00.000Z'),
  ];

  it('mantém só as entradas dentro do período (inclusive nas pontas)', () => {
    const result = filterEntriesByPeriod(entries, '2026-09-01', '2026-09-15');
    expect(result.map((e) => e.id)).toEqual(['2']);
  });

  it('sem data inicial nem final, mantém tudo', () => {
    expect(filterEntriesByPeriod(entries, '', '')).toHaveLength(3);
  });

  it('inclui o dia final inteiro, não só a meia-noite dele', () => {
    const result = filterEntriesByPeriod(entries, '2026-09-23', '2026-09-23');
    expect(result.map((e) => e.id)).toEqual(['3']);
  });
});

describe('buildJournalCsv', () => {
  it('não inclui nenhuma coluna ou valor de pontuação', () => {
    const csv = buildJournalCsv([entry('1', 'Fiz uma caminhada', '2026-09-23T13:30:00.000Z')]);
    expect(csv.toLowerCase()).not.toContain('ponto');
  });

  it('usa só as colunas Data, Horário e Entrada', () => {
    const csv = buildJournalCsv([entry('1', 'Li um livro', '2026-09-23T13:30:00.000Z')]);
    const [header] = csv.replace('﻿', '').split('\r\n');
    expect(header).toBe('Data,Horário,Entrada');
  });

  it('escapa vírgulas e aspas no conteúdo da entrada', () => {
    const csv = buildJournalCsv([entry('1', 'Fui ao mercado, li um livro e disse "oi"', '2026-09-23T13:30:00.000Z')]);
    expect(csv).toContain('"Fui ao mercado, li um livro e disse ""oi"""');
  });

  it('exporta em ordem cronológica (mais antiga primeiro)', () => {
    const csv = buildJournalCsv([
      entry('2', 'mais recente', '2026-09-23T10:00:00.000Z'),
      entry('1', 'mais antiga', '2026-09-20T10:00:00.000Z'),
    ]);
    const linhas = csv.replace('﻿', '').split('\r\n');
    expect(linhas[1]).toContain('mais antiga');
    expect(linhas[2]).toContain('mais recente');
  });
});
