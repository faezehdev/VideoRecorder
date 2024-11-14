import { useState, useRef } from "react";
import './App.css';
import Camera from "./Components/Camera";
function App() {
  let [recordOption, setRecordOption] = useState("video");
  const toggleRecordOption = (type) => {
      return () => {
          setRecordOption(type);
      };
  };
  return (
    <div className="App">
   
            <Camera />
    </div>
  );
}

export default App;
