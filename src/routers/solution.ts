import { Router } from "express";
import { Solution, Test } from "../models";
import { Error } from "mongoose";

const router = Router();

// Authentication
router.use((req, res, next) => {
  if (!req.currentUser) {
    res
      .status(400)
      .json({ message: "You must be logged in to access this resource." });
    return;
  }
  next();
});

// get solution code for test. If no solution exists create one.
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).send("Test does not exist.");
    const solution = await Solution.findOne({ test: test.id, creator: req.currentUser._id});
    if (!solution) return res.status(404).send("Solution does not exist.");
    console.log(solution, "Solution found")
    res.status(200).json(solution);
  } catch (e) {
    res.status(500).json({ message: "Server ran into an error" });
  }
})

export default router;
