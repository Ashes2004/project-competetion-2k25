import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartupHub from "./pages/StartupHub";
import AuthToggler from "./pages/Auth";
import Research from "./pages/Research";
import InnovationTracking from "./pages/InnovationTracking";
import IPR from "./pages/IPR";
import ResearchForm from "./pages/ResearchForm";
import Aboutus from "./pages/Aboutus";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          
        
        <Route path="/auth" element={<AuthToggler />} />
        
        <Route path="/innovation-tracking" element={< InnovationTracking/>} />
        
        <Route path="/startups" element={<StartupHub />} />
        <Route path="/startups/:startupId" element={<StartupHub />} />

        <Route path="/research" element = {<Research/>}/>
        <Route path="/research/form" element={<ResearchForm/>} />
        <Route path="/ipr" element = {<IPR/>}/>
        <Route path="/about" element={<Aboutus />} />
      </Routes>
    </Router>
  );
}

export default App;
