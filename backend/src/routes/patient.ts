import dotenv from "dotenv";
import { Router, Request, Response } from "express";
import { Patient } from "../models/doctors";
import authMiddleware from "../middleware/authMiddleware";
import { createPatient } from "../validations/zod";
import mongoose from "mongoose";
import Openai from "openai";

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

const router = Router();

router.post("/add", async (req: Request, res: Response) => {
  const payLoad = req.body;
  const zodValidation = createPatient.safeParse(payLoad);
  if (!zodValidation.success) {
    return res.status(411).json({
      msg: "You sent the wrong inputs",
    });
  }

  try {
    const existingPatient = await Patient.findOne({
      name: payLoad.name,
    });
    if (existingPatient) {
      return res.status(400).json({ msg: "patient already exists" });
    }

    const newPatient = await Patient.create({
      name: payLoad.name,
      age: payLoad.age,
    });

    res.status(200).json({
      msg: "patient registered successfully",
      patientId: newPatient._id,
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/report/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { report } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid patient ID" });
  }

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.reports) {
      patient.reports = [];
    }

    patient.reports.push(report);
    await patient.save();

    res.status(200).json({ message: "Report added successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.get("/bulk", authMiddleware, async (req: Request, res: Response) => {
  const filter = req.query.filter || "";
  const loggedInUserId = (req as any).userId;

  try {
    const PatienT = await Patient.find({
      _id: { $ne: loggedInUserId },
      name: {
        $regex: filter,
        $options: "i",
      },
    });

    res.json({
      Patients: PatienT.map((patient) => ({
        name: patient.name,
        age: patient.age,
        _id: patient._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching Patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json({
      name: patient.name,
      age: patient.age,
      reports: patient.reports,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getReport = async (req: Request, res: Response) => {
  const { data } = req.body;
  const sum =
    data +
    "Generate a well formatted hospital report with the following details dont do additional things on your own. DOnt you understand by repiovus prescriptions i told u to just format what i send i am sending u previous prescriptions right are u dumb why arent u printing all of that. Yes  npow you did that now format the report well dont add any node in the end  ";
  // "I will be sharing name, age and the report with the tablet name so just tell me if it is the right tablet or not disease and diagnise should match if there is mistake say what was the mistake and give me the right tabet with good diagonoise "
  try {
    const openai = new Openai({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: sum }],
      model: "gpt-3.5-turbo",
    });

    const summary = completion.choices[0].message.content;
    res.status(200).json({
      summary,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/generate-report", getReport);

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
