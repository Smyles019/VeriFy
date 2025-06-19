import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import RegisterForm from "./components/registerform.jsx";
import RegistrationSuccess from "./pages/registrationsuccess.jsx";
import Layout from "./components/layout.jsx";
import Login from "./pages/login.jsx";
import LoginForm from "./components/loginform.jsx";

function App() {
  return (
    <BrowserRouter>
      <Layout> {/* Layout wraps all routed pages */}
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/success" element={<RegistrationSuccess />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<div className="text-center mt-10">404 - Page Not Found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
