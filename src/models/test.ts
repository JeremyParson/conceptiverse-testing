import mongoose, { Model, Schema, Types } from "mongoose";
import {ITestCase} from "./testCase"

interface ITest {
    chapter: Types.ObjectId,
    className: string,
    methodName:string,
    testType: string,
    testCases: [Types.ObjectId],
    creator: Types.ObjectId
}

export interface PopulatedITest {
    testCases: [ITestCase] | null
}

type ITestModel = Model<ITest>

const TestSchema = new Schema({
    chapter: {type: Schema.Types.ObjectId, ref:'chapter', required: true},
    testType: {
        type: String,
        enum: ['function', 'class'],
        default: 'function'
    },
    className: String,
    methodName: String,
    testCases: [{ type: Schema.Types.ObjectId, ref: 'test case' }],
    creator: Schema.Types.ObjectId
});

export default mongoose.model<ITest, ITestModel>('test', TestSchema);
