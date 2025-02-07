import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import AdminHome from "./components/pages/AdminHome";

function App() {
  return (
    <>
      <Router>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<AdminHome />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
