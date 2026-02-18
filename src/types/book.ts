export type Person = {
  birth_year: number | null;
  death_year: number | null;
  name: string;
}

export type Book ={
  id: number;
  title: string;
  authors: Person[];
  summaries: string[];
  languages: string[];
  formats: Record<string, string>;
  copyright: boolean | null;
  download_count: number;
}

export type FavoriteBook = {
  book_id: string;
}

export type BookResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}