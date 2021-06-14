import * as React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStoreActions, useStoreState } from "../../Redux/Store";

interface PropTypes {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

interface ICase {
  name: string;
  group: string;
  points: number | undefined;
}

const CasesAdd = ({ isOpen, onClose, title }: PropTypes) => {
  const [isGroup, setIsGroup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const addCase = useStoreActions((actions) => actions.cases.addCase);
  const caseState = useStoreState((state) => state.cases.cases);

  function createCase(data: ICase) {
    console.log(data);

    data.group = data.group === "" ? "mainGroup" : data.group;

    let invalid = false;
    caseState.forEach((group) => {
      if (group.name === data.group) {
        group.cases.forEach((individualCase) => {
          if (individualCase.name === data.name) {
            invalid = true;
            return;
          }
        });
      }
    });

    if (invalid) {
      toast({
        title: "Nombre repetido",
        description:
          "No puedes tener casos con el mismo nombre dentro de un grupo",
        status: "error",
      });
      return;
    }

    addCase({
      name: data.name,
      group: data.group,
      arePointsDefined: !!data.points,
      points: data.points,
    });

    toast({
      title: "Caso creado",
      description: "El caso ha sido creado correctamente",
      status: "success",
    });

    onClose();
  }

  function checkIfGroup(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value !== "" ? setIsGroup(true) : setIsGroup(false);
  }

  function checkWhitespaces(inputToCheck: string): boolean {
    return !inputToCheck.includes(" ");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(createCase)} autoComplete={"off"}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel> Nombre del caso</FormLabel>
              <Input
                {...register("name", {
                  required: true,
                })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel> Nombre del grupo</FormLabel>
              <Input {...register("group")} onChange={checkIfGroup} />
            </FormControl>
            <FormControl mt={4} isDisabled={isGroup}>
              <FormLabel> Puntaje del caso (opcional)</FormLabel>
              <Input
                type={"number"}
                {...register("points", { min: 0, max: 100 })}
              />
              {isGroup && (
                <FormHelperText>
                  No puedes asignar puntos individuales si el caso está dentro
                  de un grupo
                </FormHelperText>
              )}
              {errors.points && (
                <Alert status="error" mt={3}>
                  <AlertIcon />
                  <AlertTitle mr={2}>Error</AlertTitle>
                  <AlertDescription>
                    Ingresa un número entre 0 y 100
                  </AlertDescription>
                </Alert>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" type={"submit"}>
              Agregar Caso
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CasesAdd;
