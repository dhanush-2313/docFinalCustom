import dotenv from "dotenv";
import { Router, Request, Response } from "express";
import { Doctor } from "../models/doctors";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from "../validations/zod";
import authMiddleware from "..//middleware/authMiddleware";

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const payLoad = req.body;
  const zodValidation = createUser.safeParse(payLoad);
  if (!zodValidation.success) {
    return res.status(411).json({
      msg: "You sent the wrong inputs",
    });
  }

  const existingDoctor = await Doctor.findOne({ name: payLoad.name });
  if (existingDoctor) {
    return res.status(400).json({ msg: "user already exists" });
  }

  try {
    const dbUser = await Doctor.create({
      name: payLoad.name,
      password: payLoad.password,
      age: payLoad.age,
    });
    const token = jwt.sign({ userId: dbUser._id }, secret);
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const payLoad = req.body;
  const zodValidation = loginUser.safeParse(payLoad);
  if (!zodValidation.success) {
    return res.status(411).json({
      msg: "You sent the wrong inputs",
    });
  }
  const existingDoctor = await Doctor.findOne({ name: payLoad.name });
  if (existingDoctor && existingDoctor.password === payLoad.password) {
    const token = jwt.sign({ userId: existingDoctor._id }, secret);
    return res.status(200).json({ msg: "logged in successfully", token });
  } else {
    return res.status(400).json({ msg: "wrong credentials try again" });
  }
});

router.get("/info", authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = (req as any).userId;
    const user = await Doctor.findOne({ _id: id });
    return res.json({ name: user?.name });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
