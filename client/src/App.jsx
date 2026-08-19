import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Calculator from "./pages/Calculator"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/calculator" element={<Calculator />}/>
      </Routes>
    </div>
  )
}
export default App