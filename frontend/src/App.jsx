import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartupHub from "./pages/StartupHub";
import AuthToggler from "./pages/Auth";
import Research from "./pages/Research";
import Innovation from "./pages/InnovationTracking";
import ResearchForm from "./pages/ResearchForm";
import IPRDashboard from "./pages/IPR"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          
        
        <Route path="/auth" element={<AuthToggler />} />
        
        <Route path="/innovations" element={< Innovation/>} />
        
        <Route path="/startups" element={<StartupHub />} />
        <Route path="/startups/:startupId" element={<StartupHub />} />

        <Route path="/research" element = {<Research/>}/>
        <Route path="/research/form" element={<ResearchForm/>} />

      </Routes>
    </Router>
  );
}

export default App;
