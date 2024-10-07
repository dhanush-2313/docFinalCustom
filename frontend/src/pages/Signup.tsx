// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Heading } from "../components/Heading";
// import { SubHeading } from "../components/SubHeading";
// import { InputBox } from "../components/InputBox";
// import { BottomWarning } from "../components/BottomWarning";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const token = localStorage.getItem("token");
//   const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const nameResponse = await axios.get(`${BACKENDURL}/doctor/info`, {
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         });
//         if (nameResponse.data.name) navigate("/dashboard");
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setName("");
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       if (!name || !age || !password) {
//         setError("All fields are required.");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }
//       setLoading(true);
//       const response = await axios.post(`${BACKENDURL}/doctor/signup`, {
//         name,
//         age: Number(age),
//         password,
//       });
//       localStorage.setItem("token", response.data.token);
//       navigate("/dashboard");
//     } catch (error) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-slate-300 h-screen flex justify-center">
//       <div className="flex flex-col justify-center">
//         <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
//           <Heading label={"Sign up"} />
//           <SubHeading label={"Enter your details to create an account"} />
//           <form onSubmit={handleSubmit}>
//             <InputBox
//               placeholder="name"
//               label={"name"}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setName(e.target.value)
//               }
//             />
//             <InputBox
//               placeholder="25"
//               label={"age"}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setAge(e.target.value)
//               }
//             />
//             <InputBox
//               type={"password"}
//               placeholder="********"
//               label={"password"}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setPassword(e.target.value)
//               }
//             />
//             <button
//               type="submit"
//               className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-3"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//             <div className="mt-2 text-red-500 h-6">
//               {error && <span>{error}</span>}
//             </div>
//           </form>
//           <div className="mt-4">
//             <BottomWarning
//               label={"Already have an account?"}
//               buttonText={"Sign in"}
//               to={"/signin"}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
