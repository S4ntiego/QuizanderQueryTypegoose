"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icons } from "src/components/Icons";
import { QuizAnswer } from "./QuizAnswer";
import { cn } from "src/lib/utils";
import { useStateContext } from "src/context";
import { saveQuizDataFn } from "src/api/quizApi";

export function Quiz({ quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const stateContext = useStateContext();
  const user = stateContext.state.authUser;

  const selectAnswer = (answer) => {
    setCurrentAnswer(answer);
    answer.isCorrect === true &&
      setCorrectAnswersCount(correctAnswersCount + 1);
    setDisabled(true);
    setTimeout(function () {
      !showResults && setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setDisabled(false);
      currentQuestionIndex === quiz.questions.length - 1 &&
        setShowResults(!showResults);
    }, 1000);
  };

  const handleRetake = () => {
    setCurrentAnswer("");
    setCorrectAnswersCount(0);
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const onCompleteHandle = () => {
    saveQuizDataFn(quiz._id, correctAnswersCount, quiz.title);
  };

  return (
    <div className="container max-w-3xl py-6 lg:py-10">
      {!showResults ? (
        <div>
          <div className="flex flex-col justify-center text-center gap-2">
            <p className="text-md">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </p>
            <h1 className="tracking-tight text-4xl font-black font-playfair leading-tight text-slate-900 lg:text-5xl">
              {quiz.questions[currentQuestionIndex].question}
            </h1>
          </div>
          <div className="flex flex-col justify-center my-10 gap-10">
            {quiz.questions[currentQuestionIndex].answers.map(
              (answer, index) => (
                <QuizAnswer
                  key={index}
                  onSelectAnswer={selectAnswer}
                  answer={answer}
                  disabled={disabled}
                  currentAnswer={currentAnswer}
                />
              )
            )}
          </div>
          <hr className="my-4 border-slate-200" />
          <div className="flex justify-center py-6 lg:py-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              See all quizzes
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 text-center items-center justify-center">
          <div>
            <h1
              className={cn(
                "text-slate-900 text-4xl font-playfair font-bold tracking-tight"
              )}
            >
              Congratulations!
            </h1>
            <h2 className={cn("text-slate-600 text-lg mt-2")}>
              You've completed the quiz.
            </h2>
          </div>

          <div
            className={cn(
              "aspect-square p-12 gap-2 flex flex-col text-center items-center justify-center rounded-md border border-slate-900"
            )}
          >
            <span className={cn("text-slate-600 text-lg")}>Your score:</span>
            <h1
              className={cn(
                " font-fraunces text-slate-900 -mt-2 font-semibold text-9xl"
              )}
            >
              {correctAnswersCount}
              <span className="font-playfair font-extralight mx-4 text-slate-800">
                /
              </span>
              {quiz.questions.length}
            </h1>
          </div>
          <h1
            className={cn(
              "text-slate-900 text-4xl font-playfair font-black tracking-tight"
            )}
          >
            Could be worse... but could be better!
          </h1>
          <div className={cn("flex flex-col gap-4")}>
            <div
              className={cn(
                "flex gap-4 text-center justify-center items-center"
              )}
            >
              <Link
                onClick={() => handleRetake()}
                href={`/quizzes/${quiz._id}`}
                className="flex w-48 justify-center h-11 items-center rounded-md border border-slate-900 bg-white px-8 py-2 text-center font-medium text-slate-900 transition-colors hover:bg-slate-900 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Retake quiz
              </Link>
              <button
                onClick={() => onCompleteHandle()}
                className="w-48 h-11 flex justify-center items-center rounded-md border border-slate-900 bg-white px-8 py-2 text-center font-medium text-slate-900 transition-colors hover:bg-slate-900 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Complete
              </button>
            </div>
            {!user && (
              <div>
                <Link
                  href="/login"
                  className="flex justify-center w-108 h-12 items-center rounded-md border bg-slate-900 px-8 py-2 text-center font-medium text-slate-100 transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Login to save your results
                </Link>
              </div>
            )}
            {user && (
              <div>
                <Link
                  href="/login"
                  className="flex justify-center w-108 h-12 items-center rounded-md border bg-slate-900 px-8 py-2 text-center font-medium text-slate-100 transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Save your results
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
