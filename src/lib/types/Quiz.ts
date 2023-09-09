import type { Category } from "./Category";
import type { Question } from "./Question";

export type Quiz = {
  id: number;
  name: string;
  description: string;
  questions: Question[];
  categories: Category[];
}

