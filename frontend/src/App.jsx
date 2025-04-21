import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import StartupHub from "./components/StartupHub";
import AuthToggler from "./pages/Auth";
import Research from "./pages/Research";
import InnovationTracking from "./pages/InnovationTracking";
import IPR from "./pages/IPR";



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
        <Route path="/ipr" element = {<IPR/>}/>

      </Routes>
    </Router>
  );
}

export default App;
