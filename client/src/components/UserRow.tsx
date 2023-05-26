import { Checkbox, Th, Tr } from "@chakra-ui/react"
import { TableActions, UsersReducerAction } from "./UsersTable";

export interface UserRowProps {
  userName: string,
  blocked: boolean,
  selected: boolean,
  dispatchUsers: React.Dispatch<UsersReducerAction>
}

const UserRow = ({ userName, blocked, selected, dispatchUsers }: UserRowProps) => {

  const handleCheckboxToggle = () => {
    const action = selected ? TableActions.unselect : TableActions.select;
    dispatchUsers({ type: action, payload: [{ userName: userName, blocked: blocked }] });
  };

  return (
    <Tr>
      <Th>
        <Checkbox
          h="20px"
          w="20px"
          bgColor={"#00a65092"}
          textColor={"white"}
          isChecked={selected}
          onChange={handleCheckboxToggle}
        />
      </Th>
      <Th>
        {userName}
      </Th>
      <Th>
        {blocked.toString()}
      </Th>
    </Tr>
  );
};

export default UserRow;