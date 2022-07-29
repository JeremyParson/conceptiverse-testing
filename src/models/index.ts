require('dotenv').config();
import mongoose from "mongoose";
import Test from "./test"
import Solution from "./solution"
import TestCase from "./testCase"

// connect to mongo database using MONGO URI
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export {db, Test, Solution, TestCase};
