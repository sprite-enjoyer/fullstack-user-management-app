import { Input, Flex, Button } from "@chakra-ui/react";
import RestClient from "../misc/RestClient";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";

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
      w={"100%"}
      height={"100%"}
      position={"absolute"}
      top={"0"}
      left={"0"}
      margin={"0"}
      padding={"0"}
      justify={"center"}
    >
      <Flex
        marginTop={"10%"}
        minWidth={"400px"}
        minHeight={"300px"}
        maxWidth={"35%"}
        maxHeight={"400px"}
        border={"2px solid plum"}
        flexDirection={"column"}
        justify={"center"}
        align={"center"}
        gap={"10px"}
        flex={"1 1"}
      >
        <Input
          onChange={(e) => dispatch({ type: "setUserName", payload: e.target.value })}
          size={"lg"}
          placeholder="Username"
        />
        <Input
          onChange={(e) => dispatch({ type: "setPassword", payload: e.target.value })}
          size={"lg"}
          placeholder="Password"
        />
        <Button onClick={handleButtonClick}>
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default LoginPage;