import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InnovationTracking from "./pages/InnovationTracking";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/innovation-tracking" element={<InnovationTracking />} /> 
      </Routes>
    </Router>
  );
}

export default App;
