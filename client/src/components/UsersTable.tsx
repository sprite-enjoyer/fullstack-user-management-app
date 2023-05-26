import { Table, TableContainer, Tbody, } from "@chakra-ui/react";
import RestClient from "../misc/RestClient";
import { useEffect, useReducer } from "react";
import UserRow from "./UserRow";
import TableHead from "./TableHead";

type User = { userName: string, blocked: boolean };
type UsersState = { selectedUsers: User[], allUsers: User[] };
export enum TableActions {
  setAll = "SetAll",
  selectAll = "SelectAll",
  unselectAll = "UnselectAll",
  select = "select",
  unselect = "unselect",
  delete = "delete",
  block = "block",
  unblock = "unblock"
};
export type UsersReducerAction = { type: TableActions, payload: User[] };

const usersReducer = (state: UsersState, action: UsersReducerAction): UsersState => {
  switch (action.type) {
    case TableActions.setAll: return { ...state, allUsers: [...action.payload] };
    case TableActions.selectAll: return { ...state, selectedUsers: state.allUsers };
    case TableActions.unselectAll: return { ...state, selectedUsers: [] };
    case TableActions.select: return { ...state, selectedUsers: [...state.selectedUsers, ...action.payload] };
    case TableActions.unselect:
      return {
        ...state,
        selectedUsers: state.selectedUsers.filter(x => x.userName !== action.payload[0]?.userName)
      };
    case TableActions.delete: {
      {
        RestClient.deleteManyUsers(state.selectedUsers.map(u => u.userName));
        const newAllUsers = state.allUsers.filter(x => !state.selectedUsers.map(u => u.userName).includes(x.userName));
        const newSelectedUsers = state.selectedUsers.filter(x => newAllUsers.map(u => u.userName).includes(x.userName));
        return { allUsers: newAllUsers, selectedUsers: newSelectedUsers };
      }
    }

    case TableActions.block:
      {
        RestClient.blockManyUsers(state.selectedUsers.map(u => u.userName), true);
        return {
          ...state,
          allUsers: state.allUsers
            .map(x => state.selectedUsers
              .map(u => u.userName)
              .includes(x.userName) ? { userName: x.userName, blocked: true } : x
            ),
        }
      }
    case TableActions.unblock:
      {
        RestClient.blockManyUsers(state.selectedUsers.map(u => u.userName), false);
        return {
          ...state,
          allUsers: state.allUsers
            .map(x => state.selectedUsers
              .map(u => u.userName)
              .includes(x.userName) ? { userName: x.userName, blocked: false } : x
            ),
        };
      }
    default: return state;
  }
};

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
    <TableContainer>
      <Table>
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
  );
};

export default UsersTable;