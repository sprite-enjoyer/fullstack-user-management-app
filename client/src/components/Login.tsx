import { Input, Flex, Button, Spacer, Box } from "@chakra-ui/react";
import RestClient from "../misc/RestClient";
import { useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";

type FormActionType = "setUserName" | "setPassword";
type FormState = { userName: string, password: string };
type FormAction = { type: FormActionType, payload: string };

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "setUserName": return { ...state, userName: action.payload };
    case "setPassword": return { ...state, password: action.payload };
    default: return state
  }
}

const LoginPage = () => {
  const [formState, dispatch] = useReducer(formReducer, { userName: "", password: "" });
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    const { success } = await RestClient.login(formState);
    if (success) navigate("/usersTable");
  };

  return (
    <Flex
      w={"100vw"}
      height={"100vh"}
      position={"absolute"}
      top={"0"}
      left={"0"}
      margin={"0"}
      padding={"0"}
      justify={"center"}
      bgColor={"gray.400"}
    >
      <Flex
        marginTop={"10%"}
        minWidth={"400px"}
        minHeight={"400px"}
        maxWidth={"35%"}
        maxHeight={"400px"}
        flexDirection={"column"}
        justify={"center"}
        align={"center"}
        gap={"10px"}
        flex={"1 1"}
        bgColor={"whiteAlpha.900"}
        boxShadow={"2xl"}
        borderRadius={"10px"}
        position={"relative"}
      >
        <Input
          onChange={(e) => dispatch({ type: "setUserName", payload: e.target.value })}
          size={"lg"}
          w={"50%"}
          placeholder="Username"
          type={"text"}
          colorScheme="whatsapp"
        />
        <Input
          onChange={(e) => dispatch({ type: "setPassword", payload: e.target.value })}
          size={"lg"}
          w={"50%"}
          placeholder="Password"
          type={"password"}
          colorScheme="whatsapp"

        />
        <Button
          colorScheme="whatsapp"
          onClick={handleButtonClick}
        >
          Login
        </Button>
        <Box position={"absolute"} bottom={"10%"}  >
          <Link to={"/register"}>
            <Button colorScheme="whatsapp" >
              Aren't a user? Register!
            </Button>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};

export default LoginPage;