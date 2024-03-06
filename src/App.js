import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginSignup from "./components/LoginSignup";
import Products from "./components/Products";
import { useEffect } from "react";

function App() {
  const userToken = JSON.parse(localStorage.getItem("webUserToken"));

  console.log("userToken", userToken);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/" element={<LoginSignup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
