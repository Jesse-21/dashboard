import { Flex, Input, Select, SelectProps } from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { Button } from "components/buttons/Button";
import { CURRENCIES, CurrencyMetadata } from "constants/currencies";
import { isAddress } from "ethers/lib/utils";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React, { useMemo, useState } from "react";
import { getChainIdFromNetwork } from "utils/network";
import { OtherAddressZero } from "utils/zeroAddress";

interface ICurrencySelector extends SelectProps {
  value: string;
  small?: boolean;
  hideDefaultCurrencies?: boolean;
}

export const CurrencySelector: React.FC<ICurrencySelector> = ({
  value,
  onChange,
  small,
  hideDefaultCurrencies,
  ...props
}) => {
  const chainId = getChainIdFromNetwork(useSingleQueryParam("network"));

  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [editCustomCurrency, setEditCustomCurrency] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [initialValue] = useState(value);

  const isCustomCurrency: boolean = useMemo(() => {
    if (initialValue && chainId && initialValue !== customCurrency) {
      return !CURRENCIES[chainId]?.find(
        (currency: CurrencyMetadata) =>
          currency.address.toLowerCase() === initialValue.toLowerCase(),
      );
    }

    return false;
  }, [chainId, customCurrency, initialValue]);

  const addCustomCurrency = () => {
    if (!isAddress(editCustomCurrency)) {
      return;
    }
    if (editCustomCurrency) {
      setCustomCurrency(editCustomCurrency);
      if (onChange) {
        onChange({
          target: { value: editCustomCurrency },
        } as any);
      }
    } else {
      setEditCustomCurrency(customCurrency);
    }

    setIsAddingCurrency(false);
  };

  if (isAddingCurrency && !hideDefaultCurrencies) {
    return (
      <Flex direction="column" mt={small ? 5 : 0}>
        <Button
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: "none" }}
          size="sm"
          variant="link"
          top="0"
          pos="absolute"
          alignSelf="flex-end"
          fontSize="12px"
          mb="2px"
          color="primary.500"
          cursor="pointer"
          onClick={() => setIsAddingCurrency(false)}
        >
          Cancel
        </Button>
        <Flex align="center">
          <Input
            placeholder="Enter contract address..."
            borderRadius="4px 0px 0px 4px"
            value={editCustomCurrency}
            onChange={(e) => setEditCustomCurrency(e.target.value)}
          />
          <Button
            borderRadius="0px 4px 4px 0px"
            colorScheme="primary"
            onClick={addCustomCurrency}
            isDisabled={!isAddress(editCustomCurrency)}
          >
            +
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" mt={small && !hideDefaultCurrencies ? 5 : 0}>
      {!hideDefaultCurrencies && (
        <Button
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: "none" }}
          size="sm"
          variant="link"
          top="0"
          pos="absolute"
          alignSelf="flex-end"
          fontSize="12px"
          color="primary.500"
          cursor="pointer"
          onClick={() => setIsAddingCurrency(true)}
        >
          Use Custom Currency
        </Button>
      )}
      <Select
        position="relative"
        value={
          value?.toLowerCase() === AddressZero.toLowerCase()
            ? OtherAddressZero.toLowerCase()
            : value?.toLowerCase()
        }
        onChange={onChange}
        placeholder="Select Currency"
        {...props}
      >
        {chainId &&
          !hideDefaultCurrencies &&
          CURRENCIES[chainId]
            .filter(
              (currency: CurrencyMetadata) =>
                currency.address.toLowerCase() !== AddressZero.toLowerCase(),
            )
            .map((currency: CurrencyMetadata) => (
              <option
                key={currency.address}
                value={currency.address.toLowerCase()}
              >
                {currency.symbol} ({currency.name})
              </option>
            ))}
        {isCustomCurrency && (
          <option key={initialValue} value={initialValue.toLowerCase()}>
            {initialValue}
          </option>
        )}
        {customCurrency && (
          <option key={customCurrency} value={customCurrency.toLowerCase()}>
            {customCurrency}
          </option>
        )}
      </Select>
    </Flex>
  );
};
