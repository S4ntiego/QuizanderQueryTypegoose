import { cn } from "src/lib/utils";

export function QuizAnswer({
  answer,
  onSelectAnswer,
  currentAnswer,
  disabled,
}: any) {
  const isCorrectAnswer =
    currentAnswer && answer?.isCorrect === true
      ? "bg-green-900 text-slate-100 hover:bg-green-900 border-0"
      : "";
  const isWrongAnswer =
    currentAnswer === answer && answer?.isCorrect === false
      ? "bg-red-900 text-slate-100 hover:bg-red-900 border-0"
      : "";
  const isOtherAnswer =
    currentAnswer && currentAnswer !== answer
      ? "bg-slate-900 text-slate-100 hover:bg-slate-900 border-0"
      : "";

  return (
    <button
      disabled={disabled}
      className={cn(
        `inline-block w-full h-11 items-center rounded-md border border-slate-900 bg-white px-8 py-2 text-center font-medium text-slate-900 hover:bg-slate-900 hover:text-slate-100 transition-colors`,
        isOtherAnswer,
        isWrongAnswer,
        isCorrectAnswer
      )}
      onClick={() => {
        console.log(answer);
        onSelectAnswer(answer);
      }}
    >
      <div className="answer-text">{answer?.answer}</div>
    </button>
  );
}
