import { Input, Flex, Button } from "@chakra-ui/react";

const LoginPage = () => {
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
        <Input size={"lg"} placeholder="Username" />
        <Input size={"lg"} placeholder="Password" />
        <Button>
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default LoginPage;