import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/pages/Home";
import Visualizer from "./components/pages/Visualizer";
import Race from "./components/pages/RaceMode";

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="visualizer" element={<Visualizer />} />
        <Route path="race" element={<Race />} />
      </Route>
    </Routes>
  );
}

