import type { CategoryWeight } from "./CategoryWeight";

export type Answer = {
  id: number;
  text: string;
  categoryWeights: CategoryWeight[];
}

