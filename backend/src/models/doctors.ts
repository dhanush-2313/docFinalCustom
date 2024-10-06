import dotenv from "dotenv";
import mongoose, { Schema, Document } from "mongoose";

dotenv.config();

const url = process.env.MONGO_URL as string;

mongoose.connect(url).then(() => {
  console.log("DB connected");
});

interface IDoctor extends Document {
  name: string;
  password: string;
  age: number;
}

interface IPatient extends Document {
  name: string;
  age: number;
  reports: string[];
}

interface ITablet extends Document {
  id: number;
  name: string;
  price: number;
  manufacturer_name: string;
  type: string;
  pack_size_label: string;
  short_composition1: string;
  short_composition2: string;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
});

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  reports: { type: [String], required: true },
});

const tabletSchema = new Schema<ITablet>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  manufacturer_name: { type: String, required: true },
  type: { type: String, required: true },
  pack_size_label: { type: String, required: true },
  short_composition1: { type: String, required: true },
  short_composition2: { type: String, required: true },
});

const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
const Patient = mongoose.model<IPatient>("Patient", patientSchema);
const Tablet = mongoose.model<ITablet>("Tablet", tabletSchema);

export { Doctor, Patient, Tablet };
