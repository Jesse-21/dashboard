import { ContractPermission } from "./ContractPermission";
import {
  ContractWithRoles,
  useContractConstructor,
  useContractRoleMembersList,
  useSetAllRoleMembersMutation,
} from "@3rdweb-sdk/react";
import { ButtonGroup, Flex, useToast } from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import { TransactionButton } from "components/buttons/TransactionButton";
import { ROLE_DESCRIPTION_MAP } from "constants/mappings";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { C } from "ts-toolbelt";
import { parseErrorToMessage } from "utils/errorParser";

export type PermissionFormContext = Record<
  ContractWithRoles["contractRoles"][number],
  string[]
>;

export const ContractPermissions = ({
  contract,
}: {
  contract: C.Instance<ContractWithRoles>;
}) => {
  const contractConstructor = useContractConstructor(contract);
  const roles =
    contractConstructor && "contractRoles" in contractConstructor
      ? contractConstructor.contractRoles
      : [];
  const contractRoleMembers = useContractRoleMembersList(contract);
  const setAllRolemembers = useSetAllRoleMembersMutation(contract);
  const form = useForm<PermissionFormContext>({});
  const toast = useToast();

  useEffect(() => {
    if (contractRoleMembers.data && !form.formState.isDirty) {
      form.reset(contractRoleMembers.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractRoleMembers.data]);

  return (
    <FormProvider {...form}>
      <Flex
        gap={4}
        direction="column"
        as="form"
        onSubmit={form.handleSubmit((d) =>
          setAllRolemembers.mutateAsync(d, {
            onSuccess: (_data, variables) => {
              form.reset(variables);
              toast({
                title: "Permissions updated",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            },
            onError: (error) => {
              toast({
                title: "Failed to update permissions",
                description: parseErrorToMessage(error),
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            },
          }),
        )}
      >
        {roles.map((role) => {
          return (
            <PermissionSection
              isLoading={contractRoleMembers.isLoading}
              key={role}
              role={role}
              contract={contract}
            />
          );
        })}
        <ButtonGroup justifyContent="flex-end">
          <Button
            borderRadius="md"
            isDisabled={
              !contractRoleMembers.data ||
              setAllRolemembers.isLoading ||
              !form.formState.isDirty
            }
            onClick={() => form.reset(contractRoleMembers.data)}
          >
            Reset
          </Button>
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            isDisabled={!form.formState.isDirty}
            type="submit"
            isLoading={setAllRolemembers.isLoading}
            loadingText="Saving permissions ..."
          >
            Update permissions
          </TransactionButton>
        </ButtonGroup>
      </Flex>
    </FormProvider>
  );
};

export const PermissionSection = <TContract extends ContractWithRoles>({
  role,
  contract,
  isLoading,
}: {
  contract: C.Instance<TContract>;
  role: TContract["contractRoles"][number];
  isLoading: boolean;
}) => {
  return (
    <ContractPermission
      role={role}
      isLoading={isLoading}
      contract={contract}
      description={ROLE_DESCRIPTION_MAP[role]}
    />
  );
};
