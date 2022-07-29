import { Router } from "express";
import { execSync } from "child_process"
import { Test, TestCase } from "src/models";

const router = Router();

router.post('/:id', async (req, res) => {
    const test = await Test.findById(req.params.id)
    // 1. create a test folder for this session
    // 2. get solution code and create the solution file
    // 3. gather test cases
    // 4. generate test file base off of test cases
    // 5. execute asynchronously
    // 6. parse output
    // 7. send response
    // 8. cleanup test folder
})

export default router;
