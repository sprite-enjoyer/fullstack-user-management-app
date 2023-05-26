import LoginPage from "./components/Login";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import Register from "./components/Register";
import UsersTable from "./components/UsersTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => { navigate("/usersTable"); }, []);

  return (
    <ChakraProvider>
      <Flex
        w={"100%"}
        h={"100%"}
        position={"absolute"}
        justify={"center"}
        align={"center"}
        margin={"0"}
        padding={"0"}
        top={"0"}
        left={"0"}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usersTable" element={<ProtectedRoute Child={UsersTable} />} />
        </Routes>
      </Flex>
    </ChakraProvider>
  );
};

export default App;