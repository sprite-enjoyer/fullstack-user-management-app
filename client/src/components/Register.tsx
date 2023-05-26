import { Flex, Input, Button, Box, Modal, ModalBody, ModalFooter, Text, Progress, ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react"
import { useReducer, useState } from "react";
import RestClient from "../misc/RestClient";
import { Link, useNavigate } from "react-router-dom";

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
  const [nameTaken, setNametaken] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    const { success, response } = await RestClient.register(formState);
    if (success) navigate("/login");
    if (response.taken) setNametaken(true);
  };

  return (
    <Flex
      position={"absolute"}
      top={"0"}
      left={"0"}
      margin={"0"}
      padding={"0"}
      w={"100vw"}
      h={"100vh"}
      justify={"center"}
      bgColor={"gray.400"}
    >
      <Flex
        marginTop={"10%"}
        minWidth={"400px"}
        minHeight={"500px"}
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
        <Modal
          isOpen={nameTaken}
          onClose={() => null}
          closeOnEsc
          colorScheme="whatsapp"
        >
          <ModalOverlay>
            <ModalContent>
              <ModalHeader position={"relative"} >
                <Button
                  position={"absolute"}
                  right={"10px"}
                  top={"10px"}
                  colorScheme='whatsapp'
                  size={"sm"}
                  onClick={() => setNametaken(false)}
                >
                  X
                </Button>
              </ModalHeader>
              <ModalBody>
                <Text fontSize={"xl"} >
                  username already taken!
                </Text>
              </ModalBody>
              <ModalFooter>
                <Progress value={80} />
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
        <Input
          onChange={(e) => dispatch({ type: "setUserName", payload: e.target.value })}
          placeholder="Username"
          size={"lg"}
          w={"50%"}
          type={"text"}
          colorScheme="whatsapp"
        />
        <Input
          onChange={(e) => dispatch({ type: "setPassword", payload: e.target.value })}
          placeholder="password"
          size={"lg"}
          w={"50%"}
          type={"password"}
          colorScheme="whatsapp"
        />
        <Input
          onChange={(e) => dispatch({ type: "setRepeatPassword", payload: e.target.value })}
          placeholder="repeat password"
          size={"lg"}
          w={"50%"}
          type={"password"}
          colorScheme="whatsapp"
        />
        <Button
          onClick={handleButtonClick}
          colorScheme="whatsapp"
        >
          Register
        </Button>
        <Box position={"absolute"} bottom={"10%"}  >
          <Link to={"/login"}>
            <Button colorScheme="whatsapp" >
              Already an user? Log in!
            </Button>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Register;