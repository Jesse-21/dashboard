import { CodeSnippet, Environment, SupportedEnvironment } from "./types";
import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { Button } from "components/buttons/Button";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ImCopy } from "react-icons/im";
import { SiJavascript, SiTypescript } from "react-icons/si";

interface ICodeSegment {
  snippet: CodeSnippet;
  environment: Environment;
  setEnvironment: Dispatch<SetStateAction<Environment>>;
}

const Environments: SupportedEnvironment[] = [
  {
    environment: "javascript",
    title: "JavaScript",
    icon: SiJavascript,
  },
  {
    environment: "typescript",
    title: "TypeScript",
    icon: SiTypescript,
  },
];

export const CodeSegment: React.FC<ICodeSegment> = ({
  snippet,
  environment,
  setEnvironment,
}) => {
  const activeEnvironment: Environment = useMemo(() => {
    return (
      snippet[environment] ? environment : Object.keys(snippet)[0]
    ) as Environment;
  }, [environment, snippet]);

  const activeSnippet = useMemo(() => {
    return snippet[activeEnvironment];
  }, [activeEnvironment, snippet]);

  const lines = useMemo(
    () => (activeSnippet ? activeSnippet.split("\n") : []),
    [activeSnippet],
  );

  const code = lines.join("\n");

  const { onCopy, hasCopied } = useClipboard(code);

  const environments = Environments.filter((env) =>
    Object.keys(snippet).includes(env.environment),
  );

  return (
    <Stack spacing={2}>
      <Flex justify="space-between" align="flex-end">
        <Flex direction="column" gap={4}>
          <Heading size="label.sm">Code Snippet</Heading>
          <ButtonGroup isAttached size="xs" variant="outline">
            {environments.map((env) => (
              <SupportedEnvironmentButton
                key={env.environment}
                icon={<Icon as={env.icon} />}
                active={activeEnvironment === env.environment}
                onClick={() => setEnvironment(env.environment)}
              >
                {env.title}
              </SupportedEnvironmentButton>
            ))}
          </ButtonGroup>
        </Flex>
        <Button
          size="xs"
          onClick={onCopy}
          variant="outline"
          leftIcon={<ImCopy />}
        >
          {hasCopied ? "Code copied" : "Copy code"}
        </Button>
      </Flex>

      <Box
        borderRadius="md"
        overflow="hidden"
        height={`${lines.length * 19 + 16}px`}
        w="100%"
      >
        <Editor
          theme="vs-dark"
          options={{
            padding: {
              top: 8,
              bottom: 8,
            },
            contextmenu: false,
            codeLens: false,
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: 0,
          }}
          value={code}
          defaultLanguage="javascript"
        />
      </Box>
    </Stack>
  );
};

interface ISupportedEnvironment {
  active: boolean;
  icon?: JSX.Element;
  isDisabled?: boolean;
  onClick: () => void;
}

const SupportedEnvironmentButton: React.FC<ISupportedEnvironment> = ({
  active,
  icon,
  onClick,
  children,
  isDisabled,
}) => {
  return (
    <Button
      colorScheme="yellow"
      variant={active ? "solid" : "outline"}
      onClick={onClick}
      leftIcon={icon}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
};
