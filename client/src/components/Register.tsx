import { Flex, Input, Button } from "@chakra-ui/react"
import { useReducer } from "react";
import RestClient from "../misc/RestClient";

type FormState = { userName: string; password: string; repeatPassword: string; }
type Action = { type: string; payload: string };

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'setUserName':
      return { ...state, userName: action.payload };
    case 'setPassword':
      return { ...state, password: action.payload };
    case 'setRepeatPassword':
      return { ...state, repeatPassword: action.payload };
    default:
      return state;
  }
};

const Register = () => {

  const [formState, dispatch] = useReducer(formReducer, { userName: "", password: "", repeatPassword: "" });

  return (
    <Flex
      position={"absolute"}
      top={"0"}
      left={"0"}
      margin={"0"}
      padding={"0"}
      w={"100%"}
      h={"100%"}
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
          placeholder="Username"
        />
        <Input
          onChange={(e) => dispatch({ type: "setPassword", payload: e.target.value })}
          placeholder="password"
        />
        <Input
          onChange={(e) => dispatch({ type: "setRepeatPassword", payload: e.target.value })}
          placeholder="repeat password"
        />
        <Button onClick={() => console.log(RestClient.register(formState))}>
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default Register;