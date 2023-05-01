import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./pages/CartPage";
import ItemPage from "./pages/ItemPage";
import BillsPage from "./pages/BillsPage";
import Homepage from "./pages/Homepage"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
                <Homepage />
            }
          />
          <Route
            path="/items"
            element={
                <ItemPage />
            }
          />
          <Route
            path="/cart"
            element={
                <CartPage />
            }
          />
          <Route
            path="/bills"
            element={
                <BillsPage />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
