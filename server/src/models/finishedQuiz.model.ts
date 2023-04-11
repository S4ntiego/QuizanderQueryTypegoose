import {
  prop,
  Ref,
  getModelForClass,
  modelOptions,
} from "@typegoose/typegoose";
import { User } from "./user.model";
import { Quiz } from "./quiz.model";

@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})
export class FinishedQuiz {
  readonly _id: string;

  @prop({ required: true, ref: () => Quiz })
  relatedQuiz: Ref<Quiz>;

  @prop({ required: true, ref: () => User })
  finishedBy: Ref<User>;

  @prop({})
  title: string;

  @prop({})
  scores: number[];

  @prop({ default: 0 })
  takes: number[];
}

const finishedQuizModel = getModelForClass<typeof FinishedQuiz>(FinishedQuiz);
export default finishedQuizModel;
