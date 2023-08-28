import { createHttpClient } from "../http/httpClient";
import { QuizResponse } from "../responses/QuizResponse";

const httpClient = createHttpClient({baseURL: process.env.NEXT_PUBLIC_BACKEND_URL})

export const fetchQuizzes = () => httpClient.get<QuizResponse>('/quiz');