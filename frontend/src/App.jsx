import { Routes, Route } from "react-router-dom";
import CarList from "./page/CarList";
import CarDetail from "./page/CarDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CarList />} />
      <Route path="/cars/:id" element={<CarDetail />} />
    </Routes>
  );
}

export default App;
