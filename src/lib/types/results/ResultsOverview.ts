import type { FrequenciesQuestion } from "./FrequenciesQuestion";

export type ResultsOverview = {
    categoryDistribution: { [categoryId: number]: number };
    frequencies: FrequenciesQuestion[]; 
}
