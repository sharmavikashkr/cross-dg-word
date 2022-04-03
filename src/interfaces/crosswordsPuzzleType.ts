export interface CrosswordsPuzzleType {
  title: string;
  rows: number;
  columns: number;
  grid: string[];
  gridnums: number[];
  guess: string[];
  across: Record<string, ClueType>;
  down: Record<string, ClueType>;
}

interface ClueType {
  answer: string;
  clue: string;
  row: number;
  col: number;
  guess: string;
}
