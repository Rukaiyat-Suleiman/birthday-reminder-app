import { Router } from "express";
import { renderHomePage, registerUser } from "../services/user.logic.js";

const router = Router();

router.get("/", renderHomePage);
router.post("/api/users", registerUser);

export default router;