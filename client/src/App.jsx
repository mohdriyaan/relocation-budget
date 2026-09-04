import { BrowserRouter } from "react-router-dom"
import AppLayout from "./layouts/AppLayout.jsx"
import AppRoutes from "./AppRoutes.jsx"

function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}

export default App