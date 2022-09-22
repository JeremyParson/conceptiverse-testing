import mongoose, { Model, Schema, Types } from "mongoose";

interface ISolution {
  javascript: String;
  cpp: String;
  rust: String;
  python: String;
  java: String;
  test: Types.ObjectId;
  creator: Types.ObjectId;
}

type ISolutionModel = Model<ISolution>;

const SolutionSchema = new Schema({
  javascript: String,
  cpp: String,
  rust: String,
  python: String,
  java: String,
  test: Schema.Types.ObjectId,
  creator: Schema.Types.ObjectId,
});

export default mongoose.model<ISolution, ISolutionModel>(
  "solution",
  SolutionSchema
);
