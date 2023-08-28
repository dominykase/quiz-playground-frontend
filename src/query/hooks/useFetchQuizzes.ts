import { queryKeys } from "@/utils/queryKeys"
import { useQuery } from "react-query"
import { fetchQuizzes } from "../routeCalls/localApi"



export const useFetchQuizzes = () => {
    return useQuery(
        [queryKeys.quizzes],
        fetchQuizzes
    )
}