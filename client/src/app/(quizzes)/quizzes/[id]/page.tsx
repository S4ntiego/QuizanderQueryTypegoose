import { Quiz } from "src/components/Quiz";

export async function getQuiz(id: string) {
  return await fetch(`http://localhost:8000/api/quizzes/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data.data.quiz;
    });
}

interface QuizPageProps {
  params: { id: string };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const quiz = await getQuiz(params?.id);
  console.log(quiz);

  return <Quiz quiz={quiz} />;
}
