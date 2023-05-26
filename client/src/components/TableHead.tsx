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
          <Button
            bgColor={"red.500"}
            color={"black"}
            onClick={() => dispatchUsers({ type: TableActions.block, payload: [] })}
          >
            Block
          </Button>
        </Th>
        <Th>
          <Button
            bgColor={"whatsapp.500"}
            color={"black"}
            onClick={() => dispatchUsers({ type: TableActions.unblock, payload: [] })}
          >
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
            size={"lg"}
            colorScheme={"whatsapp"}
            isChecked={selected}
            onChange={handleCheckboxToggle}
          />
        </Th>
        <Th ><Text fontSize={"2xl"} fontWeight={"semibold"}>Name</Text></Th>
        <Th><Text fontWeight={"semibold"} fontSize={"2xl"}>Blocked</Text></Th>
      </Tr>
    </Thead>
  );

};


export default TableHead;