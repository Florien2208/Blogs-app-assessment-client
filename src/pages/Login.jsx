import { useState } from "react";
import logoIconblack from "../assets/download.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Notiflix from "notiflix";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (event) => {
   event.preventDefault();

   const userData = {
     email,
     password,
   };
  

   try {
     const response = await axios.post(
       "/api/auth/login",
       userData,
       {
         headers: {
           "Content-Type": "application/json",
         },
       }
     );

     if (response.status === 200) {
      
       const data = response.data;
       const { token ,user } = data;
      
       Notiflix.Notify.success("Login successfully!");
       Cookies.set("accessToken", token);


       Cookies.set("User", JSON.stringify(user || {}));
      
         navigate("/");
     
     } else {
        Notiflix.Notify.failure("Invalid Email or Password");
       
     }
   } catch (error) {
     console.error("Error:", error);
     
   }
 };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className=" w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 flex mt-5 mb-5 flex-col justify-between bg-white border border-gray-300 rounded-2xl shadow-lg"
      >
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <img src={logoIconblack} alt="logo-icon-black" className="w-24" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login Form
        </h1>
        <label className="mb-2 text-gray-600">Email</label>
        <input
          type="text"
          placeholder="Email"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
          className="w-full p-2 mb-4 border rounded-md border-gray-400"
        />

        <label className="mb-2 text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full p-2 mb-4 border rounded-md border-gray-400"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            className="mr-2"
          />
          <span>Remember Me</span>
        </div>
        <div className="flex justify-end mb-4">
          <Link to="" className="text-blue-600 font-semibold">
            Forgot Password
          </Link>
        </div>
        <button
          type="submit"
          className="w-full p-2 mb-6 bg-yellow-500 text-white font-bold rounded-md"
        >
          Login
        </button>
        <div className="text-center">
          <h3 className="text-gray-800 mb-2">
            Does not have an account before?
          </h3>
          <Link to="/register" className="text-blue-600 text-lg">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
