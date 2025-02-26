
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (

      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
   
          </Routes>
        </Layout>
      </Router>

  );
}

export default App;
