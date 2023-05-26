import { Flex, Table, TableContainer, Tbody, } from "@chakra-ui/react";
import RestClient from "../misc/RestClient";
import { useEffect, useReducer } from "react";
import UserRow from "./UserRow";
import TableHead from "./TableHead";
import { usersReducer, User, TableActions } from "../misc/usersReducer";

const UsersTable = () => {
  const [users, dispatchUsers] = useReducer(usersReducer, { allUsers: [], selectedUsers: [] });

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await RestClient.getAllUsers() as unknown as User[];
      dispatchUsers({ type: TableActions.setAll, payload: allUsers });
    };

    fetchUsers();
  }, [usersReducer]);

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
      <TableContainer>
        <Table variant={"simple"}>
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