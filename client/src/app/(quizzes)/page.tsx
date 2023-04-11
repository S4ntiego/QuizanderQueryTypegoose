import Link from "next/link";
import { formatDate } from "../../lib/utils";
import Image from "next/image";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  questions?: [];
  coverImage: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default async function BlogPage() {
  const quizzes = await fetch("http://localhost:8000/api/quizzes")
    .then((response) => response.json())
    .then((data) => {
      return data?.data?.quizzes;
    });

  return (
    <div className="container h-full max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="font-playfair font-black tracking-tight inline-block text-4xl text-slate-900 lg:text-5xl">
            Harry Potter Trivia
          </h1>
          <p className="text-xl text-slate-600">
            Check how much you know about this magical universe
          </p>
        </div>
        <Link
          href="/guides"
          className="relative inline-flex h-11 items-center rounded-md border border-slate-900 bg-white px-8 py-2 text-center font-medium text-slate-900 transition-colors hover:bg-slate-900 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Your statistics
        </Link>
      </div>
      <hr className="my-8 border-slate-200" />
      {quizzes?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {quizzes.map((quiz, index) => (
            <article
              key={quiz._id}
              className="group relative flex flex-col space-y-2"
            >
              {quiz.coverImage && (
                <Image
                  src={quiz.coverImage}
                  alt={quiz.title}
                  width={804}
                  height={452}
                  className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
                  priority={index <= 1}
                />
              )}
              <h2 className="text-2xl font-playfair font-extrabold">
                {quiz.title}
              </h2>
              {quiz.description && (
                <p className="text-slate-600">{quiz.description}</p>
              )}
              {quiz.createdAt && (
                <p className="text-sm text-slate-600">
                  {formatDate(quiz?.createdAt)}
                </p>
              )}
              <Link href={`/quizzes/${quiz._id}`} className="absolute inset-0">
                <span className="sr-only">Play Quiz</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No quizzes published.</p>
      )}
    </div>
  );
}
