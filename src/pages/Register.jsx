import { useState } from "react";
import qt from "../assets/download.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Notiflix from "notiflix";
import Cookies from "js-cookie";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};

    if (!username.trim()) {
      formErrors.username = "Full name is required";
    }

    if (!email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid";
    }

    if (!phone.trim()) {
      formErrors.phone = "Phone number is required";
    }

    if (!location.trim()) {
      formErrors.location = "Location is required";
    }

    if (!password) {
      formErrors.password = "Password is required";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long";
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log("username", username);
      console.log("email", email);
      console.log("phoneNo", phone);
      console.log("location", location);
      console.log("password", password);
      const response = await axios.post("/api/users/signup", {
        username,
        email,
        phone,
        location,
        password,
      });
      console.log("response", response);
      if (response.status === 201) {
        const data = response.data;
        const { token, user } = data;

        console.log("User registered successfully", response.data);
        Notiflix.Notify.success("Login successfully!");
        Cookies.set("accessToken", token);

        Cookies.set("User", JSON.stringify(user || {}));
        navigate("/");
        window.location.reload();
      }else{
         Notiflix.Notify.failure(`email already exists`);
      }
    } catch (error) {
      console.error("Error during registration", error);
      Notiflix.Notify.failure(`email already exists`);
    }
  };

  return (
    <div className="w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 flex mt-5 mb-5 flex-col justify-between bg-white border border-gray-300 rounded-2xl shadow-lg"
      >
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <img src={qt} alt="logo-icon-black" className="w-24" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Signup Form
        </h1>
        <label className="mb-2 text-gray-600">Full Names</label>
        <input
          type="text"
          placeholder="Full name"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full p-2 mb-1 border rounded-md border-gray-400"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username}</p>
        )}
        <label className="mb-2 text-gray-600">Email</label>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full p-2 mb-1 border rounded-md border-gray-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}
        <label className="mb-2 text-gray-600">Phone number</label>
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full p-2 mb-1 border rounded-md border-gray-400"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
        )}
        <label className="mb-2 text-gray-600">Location</label>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="w-full p-2 mb-1 border rounded-md border-gray-400"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mb-2">{errors.location}</p>
        )}
        <label className="mb-2 text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full p-2 mb-1 border rounded-md border-gray-400"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}
        <label className="mb-2 text-gray-600">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full p-2 mb-1 border rounded-md border-gray-400"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          className="w-full p-2 mb-6 bg-yellow-500 text-white font-bold rounded-md"
        >
          Signup
        </button>
        <div className="text-center">
          <h3 className="text-gray-800">
            Back to{"  "}
            <Link to="/login" className="text-blue-600 text-lg">
              Login
            </Link>
          </h3>
        </div>
      </form>
    </div>
  );
};

export default Register;
