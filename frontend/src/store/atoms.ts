import { atom } from "recoil";

export const passwordState = atom({
  key: "passwordState",
  default: "",
});

export const loadingState = atom({
  key: "loadingState",
  default: false,
});

export const errorState = atom<string | null>({
  key: "errorState",
  default: null,
});

// Atoms from patientAtoms.ts
interface Patient {
  name: string;
  age: number;
  reports?: string[];
}

export const patientState = atom<Patient | null>({
  key: "patientState",
  default: null,
});

export const patientLoadingState = atom<boolean>({
  key: "patientLoadingState",
  default: true,
});

export const patientErrorState = atom<string | null>({
  key: "patientErrorState",
  default: null,
});

export const doctorNameState = atom<string>({
  key: "doctorNameState",
  default: "",
});

export const tabletsState = atom<{ id: number; name: string }[]>({
  key: "tabletsState",
  default: [],
});

export const searchTermState = atom<string>({
  key: "searchTermState",
  default: "",
});

export const pageState = atom<number>({
  key: "pageState",
  default: 1,
});

export const debouncedSearchTermState = atom<string>({
  key: "debouncedSearchTermState",
  default: "",
});

export const reportState = atom<string>({
  key: "reportState",
  default: "",
});

export const isRecordingState = atom<boolean>({
  key: "isRecordingState",
  default: false,
});

export const isGeneratingState = atom<boolean>({
  key: "isGeneratingState",
  default: false,
});

// Atoms from patientAddAtoms.ts
export const inputDataState = atom<string>({
  key: "inputDataState",
  default: "",
});

export const ageState = atom<number>({
  key: "ageState",
  default: 0,
});

// Atoms from another file
export const patientsState = atom({
  key: "patientsState",
  default: [],
});

export const isDeletingState = atom({
  key: "isDeletingState",
  default: false,
});

export const filterState = atom({
  key: "filterState",
  default: "",
});

export const debouncedFilterState = atom({
  key: "debouncedFilterState",
  default: "",
});
