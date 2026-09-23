import type { JournalEntry } from '../types/wellness';
import { formatClock, formatFullDate } from './time';

/**
 * Exportação do Diário — item isolado do sistema de pontuação do Mascote.
 * Propositalmente só usa `content`/`createdAt` de cada entrada; nunca deve
 * ler ou incluir pontos, já que a pontuação é uma informação interna do
 * Mascote (ver MascotContext.tsx) e não faz parte do que o usuário
 * registrou no Diário.
 */

/** Escapa um campo para CSV (RFC 4180): aspas duplicadas e o campo entre
 * aspas sempre que contiver vírgula, aspas ou quebra de linha. */
function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Filtra entradas cujo `createdAt` caia dentro de [startDate, endDate],
 * inclusive nos dois extremos (o dia final inteiro é considerado). Datas
 * no formato "yyyy-mm-dd" (o que um <input type="date"> produz). */
export function filterEntriesByPeriod(
  entries: JournalEntry[],
  startDate: string,
  endDate: string
): JournalEntry[] {
  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
  return entries.filter((entry) => {
    const at = new Date(entry.createdAt);
    if (start && at < start) return false;
    if (end && at > end) return false;
    return true;
  });
}

/**
 * Monta o CSV das entradas — colunas "Data", "Horário" e "Entrada" apenas.
 * Sem pontuação: a exportação representa só o que foi escrito no Diário.
 */
export function buildJournalCsv(entries: JournalEntry[]): string {
  const header = ['Data', 'Horário', 'Entrada'].join(',');
  // As entradas já vêm mais recentes primeiro (ver JournalContext); a
  // exportação fica mais fácil de ler em ordem cronológica.
  const chronological = [...entries].reverse();
  const rows = chronological.map((entry) =>
    [formatFullDate(entry.createdAt), formatClock(entry.createdAt), csvField(entry.content)].join(',')
  );
  // BOM (\ufeff) no início evita que o Excel abra acentos corrompidos.
  return '\ufeff' + [header, ...rows].join('\r\n');
}

/** Dispara o download de um CSV no navegador — sem precisar de backend. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
