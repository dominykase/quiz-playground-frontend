import { ReactElement } from "react";

const CategoryStep = (): ReactElement => {

    return (
        <div className="bg-slate-100 flex justify-center flex-col" style={{width: window.innerWidth + 'px', height: window.innerHeight + 'px'}}>
            <div className="mt-5 bg-red-100" style={{width: '16rem', height: '9rem'}}></div>
            <p>The results of your quiz consist of categories in which the score might fall into. Each answer in your quiz, as you will later see, will assign points to each category, ranging from 0 to 10.</p>
            <p>For example, in a quiz called "Are you an introvert or an extrovert?", a specific answer like "I am an outgoing person" might attribute <strong>7</strong> points to extrovert category and <strong>4</strong> to introvert category.</p>
            <p>At the end of your quiz, the quiz-taker will see a full distribution of points across categories to gain further insight into their results.</p>
            <p>Please choose your categories.</p>
        </div>
    )
}

export default CategoryStep;