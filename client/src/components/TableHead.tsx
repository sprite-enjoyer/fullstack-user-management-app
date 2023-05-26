import { Button, Checkbox, Spacer, Th, Thead, Tr, useBoolean, Text } from "@chakra-ui/react";
import { TableActions, UsersReducerAction } from "../misc/usersReducer";

export interface TableHeadProps {
  dispatchUsers: React.Dispatch<UsersReducerAction>
}

const TableHead = ({ dispatchUsers }: TableHeadProps) => {
  const [selected, setSelected] = useBoolean(false);

  const handleCheckboxToggle = () => {
    const action = selected ? TableActions.unselectAll : TableActions.selectAll;
    setSelected.toggle();
    dispatchUsers({ type: action, payload: [] });
  };

  return (
    <Thead>
      <Tr>
        <Th>
          <Button onClick={() => dispatchUsers({ type: TableActions.block, payload: [] })} >
            Block
          </Button>
        </Th>
        <Th>
          <Button onClick={() => dispatchUsers({ type: TableActions.unblock, payload: [] })}>
            Unblock
          </Button>
        </Th>
        <Th>
          <Button onClick={() => dispatchUsers({ type: TableActions.delete, payload: [] })}>
            Delete
          </Button>
        </Th>
      </Tr>
      <Tr>
        <Th>
          <Checkbox
            h="35px"
            w="35px"
            fontSize={"28px"}
            bgColor={"#00a65092"}
            textColor={"white"}
            isChecked={selected}
            onChange={handleCheckboxToggle}
          />
        </Th>
        <Th >
          <Text fontStyle={"normal"} fontSize={"2xl"}>
            Name
          </Text>
        </Th>
        <Th>
          <Text fontStyle={"normal"} fontSize={"2xl"} >
            Blocked
          </Text>
        </Th>
      </Tr>
    </Thead>
  );

};


export default TableHead;