import {
  prop,
  Ref,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})
class Answer {
  @prop({ required: true })
  answer: string;
  @prop({ required: true })
  isCorrect: boolean;
}

class Question {
  @prop({ required: true })
  question: string;
  @prop({ required: true })
  answers: Answer[];
}

export class Quiz {
  readonly _id: string;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  questions: Question[];

  @prop({ required: true })
  category: string;

  @prop({ required: true })
  coverImage: string;

  @prop({ default: Date.now })
  createdAt: string;

  @prop({ required: true, ref: () => User })
  createdBy: Ref<User>;

  @prop({ default: 0 })
  plays: number;

  @prop({ required: true, default: "multiple choice" })
  type: string;

  @prop({})
  scores: number[];
}

const quizModel = getModelForClass<typeof Quiz>(Quiz);
export default quizModel;
