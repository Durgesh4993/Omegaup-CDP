import * as React from "react";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  toast,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../../../Redux/Store";

interface PropTypes {
  onClose: () => void;
  initial?: {
    groupName: string;
    points: number;
    pointsDefined: boolean;
    cases: object[];
  };
  edit: boolean;
  submitButton: string;
}
const AddGroupModal = ({ onClose, initial, submitButton, edit }: PropTypes) => {
  const [autoPoints, setAutoPoints] = useState(
    initial?.pointsDefined ? !initial?.pointsDefined : true
  );

  const groupName = useRef<string>(initial ? initial.groupName : "");
  const points = useRef<number>(initial ? initial.points : 50);
  const pointsDefined = useRef<boolean>(
    initial ? initial.pointsDefined : false
  );

  const addGroup = useStoreActions((actions) => actions.cases.addGroup);
  const editGroup = useStoreActions((actions) => actions.cases.editGroup);
  const groupData = useStoreState((state) => state.cases.data);

  const toast = useToast();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let isValid = true;
    groupData.forEach((groupElement) => {
      if (
        groupElement.name === groupName.current &&
        groupElement.name !== initial?.groupName
      ) {
        isValid = false;
        return;
      }
    });

    if (!isValid) {
      toast({
        title: "Error al crear grupo",
        description: "No puedes tener grupos con el mismo nombre",
        status: "error",
        isClosable: true,
      });
      return;
    }

    console.log(groupName.current);
    if (edit) {
      editGroup({
        payload: {
          name: groupName.current,
          cases: initial
            ? initial?.cases
            : [{ name: "", points: 0, group: "", defined: false, ioData: [] }],
          points: points.current,
          defined: pointsDefined.current,
        },
        oldName: initial ? initial?.groupName : "",
      });
    } else {
      addGroup({
        name: groupName.current,
        cases: [],
        points: points.current,
        defined: pointsDefined.current,
      });
    }

    onClose();
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormControl mt={3} isRequired>
        <FormLabel> Nombre del grupo</FormLabel>
        <Input
          onChange={(e) => (groupName.current = e.target.value)}
          defaultValue={initial?.groupName}
        />
      </FormControl>
      <FormControl mt={5}>
        <FormLabel> Puntaje </FormLabel>
        <NumberInput
          onChange={(e, valueAsNumber) => (points.current = valueAsNumber)}
          defaultValue={initial?.points}
          min={0}
          max={100}
          isDisabled={autoPoints}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {autoPoints && (
          <FormHelperText>
            El programa calculará automáticamente el puntaje
          </FormHelperText>
        )}
        <Checkbox
          mt={3}
          isChecked={autoPoints}
          onChange={() => {
            setAutoPoints(!autoPoints);
            pointsDefined.current = autoPoints;
          }}
        >
          Puntaje automático
        </Checkbox>
      </FormControl>
      <Button colorScheme="green" isFullWidth mt={10} type={"submit"}>
        {submitButton}
      </Button>
    </form>
  );
};

export default AddGroupModal;