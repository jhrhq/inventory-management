import { Container } from "react-bootstrap";

import { Route, Routes } from "react-router-dom";
import Home from "./Components/home/home";
import Signin from "./Components/home/signin";
import Signup from "./Components/home/signup";
import UserDashboard from "./Components/home/user-dashboard/user-dashboard";
import Navigation from "./Components/navbar";
import NotFound from "./Components/no-found/not-found";

function App() {
  return (
    <>
      <Navigation />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/passwordreset" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      ;
    </>
  );
}

export default App;
