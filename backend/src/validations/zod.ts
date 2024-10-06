import { z } from "zod";

const createUser = z.object({
  name: z.string(),
  password: z.string(),
  age: z.number(),
});

const loginUser = z.object({
  name: z.string(),
  password: z.string(),
});

const createPatient = z.object({
  name: z.string(),
  age: z.number(),
});

export { createUser, loginUser, createPatient };
