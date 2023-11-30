import type { FrequenciesAnswer } from "./FrequenciesAnswer";

export type FrequenciesQuestion = {
    id: number;
    questionText: string;
    answers: FrequenciesAnswer[];
}
