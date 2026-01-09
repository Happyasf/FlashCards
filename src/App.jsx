import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Topic from "./pages/Topic";
import AddCard from "./pages/AddCard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topic/:id" element={<Topic />} />
        <Route path="/addcard/:id" element={<AddCard />} />
      </Routes>
    </BrowserRouter>
  );
}
