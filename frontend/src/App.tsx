import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./component/login";
import { Home } from "./component/home";
import { Navigation } from "./component/navigation";
import { Logout } from "./component/logout";
import Register from "./component/register";
import PieceId from "./component/pieceIdentity";
import Terass from "./component/test_terras.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/piece_id" element={<PieceId />} />
        <Route path="/terass" element={<Terass />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
