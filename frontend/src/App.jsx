import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StartupHub from "./components/StartupHub";
import AuthToggler from "./pages/Auth";
import Research from "./pages/Research";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthToggler />} />
        
        <Route path="/startup-hub" element={<StartupHub />} />
        <Route path="/startup-hub/:startupId" element={<StartupHub />} />

        <Route path="/research" element = {<Research/>}/>
      </Routes>
    </Router>
  );
}

export default App;
