import { useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { useRecoilState } from "recoil";
import {
  debouncedSearchTermState,
  doctorNameState,
  inputDataState,
  isGeneratingState,
  isRecordingState,
  pageState,
  searchTermState,
  tabletsState,
} from "../store/atoms";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

export default function PatientAdd() {
  const [inputData, setInputData] = useRecoilState(inputDataState);
  const [isRecording, setIsRecording] = useRecoilState(isRecordingState);
  const [isGenerating, setIsGenerating] = useRecoilState(isGeneratingState);
  const [tablets, setTablets] = useRecoilState(tabletsState);
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
  const [page, setPage] = useRecoilState(pageState);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useRecoilState(
    debouncedSearchTermState
  );
  const [doctorName, setDoctorName] = useRecoilState(doctorNameState);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nameResponse = await axios.get(`${BACKENDURL}/doctor/info`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (nameResponse.data.name) {
          setDoctorName(nameResponse.data.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDoctorName("");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch tablets when page or debounced search term changes
  useEffect(() => {
    const fetchTablets = async () => {
      try {
        const response = await axios.get(`${BACKENDURL}/tablets`, {
          params: { page, search: debouncedSearchTerm },
        });
        setTablets(response.data);
      } catch (error) {
        console.error("Error fetching tablets:", error);
      }
    };

    fetchTablets();
  }, [page, debouncedSearchTerm]);

  const handleChange = (e: any) => {
    setInputData(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition =
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Keep listening until stopped

    recognition.onresult = (event: any) => {
      const speechResult = event.results[event.resultIndex][0].transcript;
      const tabletMatch = speechResult.match(/tablet\s+(\w+)/);
      if (tabletMatch) {
        const tabletName = tabletMatch[1];
        setSearchTerm(tabletName);
      } else {
        setInputData((prevReport) => prevReport + " " + speechResult);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start(); // Restart recognition if still recording
      }
    };

    recognition.start();
    setIsRecording(true);
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      // @ts-ignore
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const parseInputData = (input: string) => {
    const fields = input.split(" ");
    let name = "";
    let age = "";
    let report = "";
    let i = 0;

    while (i < fields.length) {
      switch (fields[i].toLowerCase()) {
        case "name":
          name = fields[i + 1];
          i += 2;
          break;
        case "age":
          age = fields[i + 1];
          i += 2;
          break;
        default:
          report += ` ${fields[i]}`;
          i++;
          break;
      }
    }

    return { name, age, report: report.trim() };
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { name, age, report } = parseInputData(inputData);

    if (!name || !age || !report) {
      alert("Please provide name, age, and report.");
      return;
    }

    try {
      // Register patient
      const registerResponse = await axios.post(`${BACKENDURL}/patient/add`, {
        name,
        age: Number(age),
      });

      // Extract patient ID from the response
      const patientId = registerResponse.data.patientId;

      // Save report
      await axios.post(`${BACKENDURL}/patient/report/${patientId}`, {
        report,
      });

      // Generate report
      await generateReport(name, age, report);

      alert("Patient registered and report added successfully");
    } catch (err) {
      console.error("Error registering patient or adding report", err);
    }
  };

  const generateReport = async (name: string, age: string, report: string) => {
    setIsGenerating(true);

    const prompt = `
      CLINIC NAME: ANUGRAHA CLINIC
      DOCTOR NAME: Dr. ${doctorName}

      DATE TIME: ${new Date().toLocaleString()}

      PATIENT DETAILS:
      Name: ${name}
      Age: ${age}

      PRESCRIPTION:
      ${report}
    `;

    try {
      const response = await axios.post(
        `${BACKENDURL}/patient/generate-report`,
        { data: prompt }
      );
      const { summary } = response.data;

      navigate("/report", {
        state: {
          report: `${summary}`,
          patientDetails: {
            fullName: name,
            age: age,
          },
        },
      });
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleTabletDoubleClick = (tabletName: string) => {
    setInputData((prevInputData) => `${prevInputData} \n ${tabletName}`.trim());
  };

  return (
    <>
      <Appbar />

      <div className="flex h-screen">
        <div className="w-1/2 p-4 border-r border-gray-300">
          <div className="flex items-center text-3xl mb-4">
            Register Patient and Add Report
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label htmlFor="inputData" className="mb-2">
                Input (Name, Age, Report)
              </label>
              <textarea
                id="inputData"
                name="inputData"
                value={inputData}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleSpeechRecognition}
                className="p-2 bg-blue-500 text-white rounded"
                disabled={isRecording}
              >
                {isRecording ? "Recording..." : "Start Recording"}
              </button>
              {isRecording && (
                <button
                  type="button"
                  onClick={stopSpeechRecognition}
                  className="p-2 bg-red-500 text-white rounded ml-2"
                >
                  Stop Recording
                </button>
              )}
            </div>
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded mt-4"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating Report..." : "Submit"}
            </button>
          </form>
        </div>
        <div className="w-1/2 p-4">
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search tablets..."
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="list-disc pl-5">
              {Array.isArray(tablets) &&
                tablets.slice(0, 20).map((tablet) => (
                  <li
                    key={tablet.id}
                    className="mb-2 cursor-pointer"
                    onDoubleClick={() => handleTabletDoubleClick(tablet.name)}
                  >
                    {tablet.name}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 bg-gray-500 text-white rounded"
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
