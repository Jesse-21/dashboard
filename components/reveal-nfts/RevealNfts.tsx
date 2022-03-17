import { useRevealMutation } from "@3rdweb-sdk/react/hooks/useDrop";
import { BatchToReveal, DropModule } from "@3rdweb/sdk";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { RevealInput, RevealSchema } from "schema/tokens";
import { parseErrorToMessage } from "utils/errorParser";

interface RevealNftsModalProps {
  module?: DropModule;
  isOpen: boolean;
  onClose: () => void;
  batch: BatchToReveal;
}

export const RevealNftsModal: React.FC<RevealNftsModalProps> = ({
  isOpen,
  onClose,
  module,
  batch,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RevealInput>({
    resolver: zodResolver(RevealSchema),
  });

  const reveal = useRevealMutation(module);

  const toast = useToast();

  const onSuccess = (): void => {
    toast({
      title: "Success",
      description: "Batch revealed successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  const onSubmit = (data: RevealInput) => {
    reveal.mutate(
      {
        batchId: batch.batchId,
        password: data.password,
      },
      {
        onSuccess,
        onError: (error) => {
          toast({
            title: "Error revealing batch upload",
            description: parseErrorToMessage(error),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          Reveal Password for {batch?.placeholderMetadata?.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={!!errors.password} mr={4}>
            <Input
              {...register("password")}
              placeholder="Password you previously used to batch upload"
              type="password"
            />
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            mt={4}
            size="md"
            colorScheme="blue"
            isLoading={reveal.isLoading}
            type="submit"
          >
            Reveal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
