import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartupHub from "./pages/StartupHub";
import AuthToggler from "./pages/Auth";
import Research from "./pages/Research";

import ResearchForm from "./pages/ResearchForm";
import IPRDashboard from "./pages/IPR"
import Innovation from "./pages/InnovationTracking";
import IPRApplicationGuide from "./pages/IPRGuide";
import ResearchPaperAdmin from "./pages/ReserachDashboard";
import Aboutus from "./pages/Aboutus";
import UserProfile from "./pages/UserProfile";
import ResearchMedia from "./pages/ResearchMedia";
import RIISEBot from "./pages/RiiseBot";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          
        <Route path="/ipr/guide" element = {<IPRApplicationGuide/>}/>
        <Route path="/auth" element={<AuthToggler />} />
        <Route path="/ipr" element={<IPRDashboard />} />
        <Route path="/riisebot" element={<RIISEBot />} />
        <Route path="/innovations" element={< Innovation/>} />
        <Route path="/about" element={< Aboutus/>} />
        
        <Route path="/startups" element={<StartupHub />} />
        <Route path="/startups/:startupId" element={<StartupHub />} />

        <Route path="/research" element = {<Research/>}/>
        <Route path="/research/find" element = {<ResearchMedia/>}/>
        <Route path="/research/dashboard" element = {<ResearchPaperAdmin/>}/>
        <Route path="/research/form" element={<ResearchForm/>} />
        <Route path="/user/profile" element={<UserProfile/>} />

      </Routes>
    </Router>
  );
}

export default App;
