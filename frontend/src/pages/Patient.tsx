import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar"; // Assuming you have an Appbar component
import { useRecoilState, useRecoilValue } from "recoil";
import {
  debouncedSearchTermState,
  doctorNameState,
  errorState,
  isGeneratingState,
  isRecordingState,
  loadingState,
  pageState,
  patientState,
  reportState,
  searchTermState,
  tabletsState,
} from "../store/atoms";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

interface Patient {
  name: string;
  age: number;
  reports?: string[];
}

export default function Patient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useRecoilState(patientState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [error, setError] = useRecoilState(errorState);
  const doctorName = useRecoilValue(doctorNameState);
  const [tablets, setTablets] = useRecoilState(tabletsState);
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
  const [page, setPage] = useRecoilState(pageState);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useRecoilState(
    debouncedSearchTermState
  );
  const [report, setReport] = useRecoilState(reportState);
  const [isRecording, setIsRecording] = useRecoilState(isRecordingState);
  const [isGenerating, setIsGenerating] = useRecoilState(isGeneratingState);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`${BACKENDURL}/patient/${id}`);
        setPatient(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatient();
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
    recognition.continuous = true; // Keep listening continuously

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const speechResult =
        event.results[event.resultIndex][0].transcript.toLowerCase();

      // Check if the speech result contains the word "tablet" followed by the tablet name
      const tabletMatch = speechResult.match(/tablet\s+(\w+)/);
      if (tabletMatch) {
        const tabletName = tabletMatch[1];
        setSearchTerm(tabletName);
      } else {
        setReport((prevReport) => prevReport + " " + speechResult);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start(); // Restart recognition if still recording
      } else {
        setIsRecording(false);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  // const handleSubmitReport = async () => {
  //   if (!report.trim()) {
  //     alert("Report field is required.");
  //     return;
  //   }

  //   try {
  //     await axios.post(`${BACKENDURL}/patient/report/${id}`, {
  //       report,
  //     });
  //     alert("Report submitted successfully");
  //   } catch (err) {
  //     console.error("Error submitting report", err);
  //   }
  // };

  const generateReport = async () => {
    if (!patient) return;

    setIsGenerating(true);

    const existingReports = patient.reports
      ? patient.reports.join("\n")
      : "No previous reports.";

    const prompt = `
      CLINIC NAME: ANUGRAHA CLINIC
      DOCTOR NAME: Dr. ${doctorName}

      DATE TIME: ${new Date().toLocaleString()}

      PATIENT DETAILS:
      Name: ${patient.name}
      Age: ${patient.age}

      PREVIOUS PRECRIPTIONS:
      ${existingReports}

      ${report && report.trim() !== "" ? `PRESCRIPTION: ${report}` : ""}
      
     
    `;

    try {
      if (report && report.trim() !== "") {
        await axios.post(`${BACKENDURL}/patient/report/${id}`, {
          report,
        });
      }

      const response = await axios.post(
        `${BACKENDURL}/patient/generate-report`,
        { data: prompt }
      );
      const { summary } = response.data;

      navigate("/report", {
        state: {
          report: `${summary}`,
          patientDetails: {
            fullName: patient.name,
            age: patient.age,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error: {error}
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No patient data available.
      </div>
    );
  }

  const handleTabletDoubleClick = (tabletName: string) => {
    setReport((prevInputData) => `${prevInputData} \n ${tabletName}`.trim());
  };

  return (
    <>
      <Appbar />
      <div className="flex h-screen">
        <div className="w-1/2 p-4 border-r border-gray-300">
          <div className="bg-white shadow-md rounded p-6 w-full ">
            <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {patient.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Age:</span> {patient.age}
            </div>
            <div className="mt-4">
              <button
                onClick={handleSpeechRecognition}
                className="p-2 bg-blue-500 text-white rounded"
                disabled={isRecording}
              >
                {isRecording ? "Recording..." : "Start Recording"}
              </button>
              {isRecording && (
                <button
                  onClick={stopSpeechRecognition}
                  className="p-2 bg-red-500 text-white rounded ml-2"
                >
                  Stop Recording
                </button>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Report</h3>
              <textarea
                className="p-2 border border-gray-300 rounded w-full h-60"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                rows={4}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={generateReport}
                className="p-2 bg-green-500 text-white rounded"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating Report..." : "Generate Report"}
              </button>
            </div>
            {patient.reports && patient.reports.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Previous Reports</h3>
                <ul className="list-disc pl-5">
                  {patient.reports.map((report, index) => (
                    <li key={index}>{report}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
