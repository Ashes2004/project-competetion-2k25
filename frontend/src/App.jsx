import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import StartupHub from "./components/StartupHub";
import AuthToggler from "./pages/Auth";
import Research from "./pages/Research";
import InnovationTracking from "./pages/InnovationTracking";
import ResearchForm from "./pages/ResearchForm";
import IPRDashboard from "./pages/IPR"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          
        
        <Route path="/auth" element={<AuthToggler />} />
        
        <Route path="/innovation-tracking" element={< InnovationTracking/>} />
        
        <Route path="/startup-hub" element={<StartupHub />} />
        <Route path="/startup-hub/:startupId" element={<StartupHub />} />

        <Route path="/research" element = {<Research/>}/>
        <Route path="/research/form" element={<ResearchForm/>} />
        <Route path="/ipr" element = {<IPRDashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
