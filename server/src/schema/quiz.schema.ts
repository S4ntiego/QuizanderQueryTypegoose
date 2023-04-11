import { any, number, object, string, TypeOf } from "zod";

export const createQuizSchema = object({
  files: object({
    fieldname: string(),
    originalname: string(),
    encoding: string(),
    mimetype: string(),
    buffer: any(),
    size: number(),
  }),
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    description: string({
      required_error: "Content is required",
    }),
    category: string({
      required_error: "Category is required",
    }),
    questions: any({
      required_error: "At least one question is required",
    }),
  }),
});

const params = {
  params: object({
    _id: string(),
  }),
};

export const getQuizSchema = object({
  ...params,
});

export const updateQuizSchema = object({
  ...params,
  body: object({
    title: string(),
    description: string(),
    category: string(),
    questions: object({}),
    coverImage: string(),
  }).partial(),
});

export const deleteQuizSchema = object({
  ...params,
});

export type CreateQuizInput = TypeOf<typeof createQuizSchema>["body"];
export type GetQuizInput = TypeOf<typeof getQuizSchema>["params"];
export type UpdateQuizInput = TypeOf<typeof updateQuizSchema>;
export type DeleteQuizInput = TypeOf<typeof deleteQuizSchema>["params"];
