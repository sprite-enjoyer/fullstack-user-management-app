import { Button, Flex, Table, TableContainer, Tbody, } from "@chakra-ui/react";
import RestClient from "../misc/RestClient";
import { useEffect, useReducer } from "react";
import UserRow from "./UserRow";
import TableHead from "./TableHead";
import { usersReducer, User, TableActions } from "../misc/usersReducer";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, dispatchUsers] = useReducer(usersReducer, { allUsers: [], selectedUsers: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await RestClient.getAllUsers() as unknown as User[];
      dispatchUsers({ type: TableActions.setAll, payload: allUsers });
    };

    fetchUsers();
  }, [usersReducer]);

  const handleSignOut = async () => {
    const { success } = await RestClient.signOut();
    if (success) navigate("/login");
  };

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      position={"absolute"}
      justify={"center"}
      align={"center"}
      margin={"0"}
      padding={"0"}
      top={"0"}
      left={"0"}
      bgColor={"gray.400"}
    >
      <Button
        position={"absolute"}
        top={"20px"}
        right={"20px"}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
      <TableContainer
        bgColor={"whiteAlpha.900"}
        borderRadius={"10px"}
        padding={"20px"}
        boxShadow={"2xl"}
        minW={"800px"}

      >
        <Table
          variant={"simple"}
          size={"lg"}
        >
          <TableHead dispatchUsers={dispatchUsers} />
          <Tbody>
            {users.allUsers.map((user, i) =>
              <UserRow
                key={i}
                userName={user.userName}
                blocked={user.blocked}
                selected={users.selectedUsers.map(u => u.userName).includes(user.userName)}
                dispatchUsers={dispatchUsers}
              />
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default UsersTable;