import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartupHub from "./components/StartupHub";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startup-hub" element={<StartupHub />} />
        <Route path="/startup-hub/:startupId" element={<StartupHub />} />
      </Routes>
    </Router>
  );
}

export default App;
