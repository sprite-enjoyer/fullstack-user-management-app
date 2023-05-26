import { Checkbox, Th, Tr, Text } from "@chakra-ui/react";
import { TableActions, UsersReducerAction } from "../misc/usersReducer";

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
          isChecked={selected}
          colorScheme={"whatsapp"}
          onChange={handleCheckboxToggle}
        />
      </Th>
      <Th>
        <Text fontWeight={"normal"}>{userName}</Text>
      </Th>
      <Th>
        <Text fontWeight={"normal"}>{blocked.toString()}</Text>
      </Th>
    </Tr>
  );
};

export default UserRow;