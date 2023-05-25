import LoginPage from "./components/Login";
import { Flex } from "@chakra-ui/react";
import Register from "./components/Register";

const App = () => {
  return (
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
      <Register />
    </Flex>
  );
};

export default App;