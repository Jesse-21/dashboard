import {
  AspectRatio,
  Box,
  BoxProps,
  Center,
  Icon,
  Image,
  LayoutProps,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import React, { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { AiFillEye, AiOutlineFileAdd } from "react-icons/ai";
import { FiImage, FiUpload } from "react-icons/fi";

interface IFileInputProps extends BoxProps {
  accept?: HTMLInputElement["accept"];
  setValue: (file: File) => void;
  isDisabled?: boolean;
  value?: string | File;
  showUploadButton?: true;
  maxContainerWidth?: LayoutProps["maxW"];
}

export const FileInput: React.FC<IFileInputProps> = ({
  setValue,
  isDisabled,
  accept,
  showUploadButton,
  value,
  children,
  maxContainerWidth,
  ...restBoxProps
}) => {
  const onDrop = useCallback<
    <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => void
  >(
    (droppedFiles) => {
      if (droppedFiles && droppedFiles[0]) {
        setValue(droppedFiles[0]);
      }
    },
    [setValue],
  );
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept,
  });

  const file: File | null = value instanceof File ? value : null;
  const fileUrl = useImageFileOrUrl(value);
  const helperText = accept === "image/*" ? "image" : "file";

  // Don't display non image file types
  const noDisplay = file && !file.type.includes("image");

  const fileType = file
    ? file.type.includes("image")
      ? "Image"
      : file.type.includes("audio")
      ? "Audio"
      : file.type.includes("video")
      ? "Video"
      : file.type.includes("csv")
      ? "CSV"
      : file.type.includes("text") || file.type.includes("pdf")
      ? "Text"
      : file.type.includes("model") || file.name.endsWith(".glb")
      ? "3D Model"
      : "Media"
    : null;

  if (children) {
    return (
      <Box {...restBoxProps} cursor="pointer" {...getRootProps()}>
        {children}
        <input {...getInputProps()} />
      </Box>
    );
  }

  return (
    <Stack spacing={4} direction="row" align="center">
      <AspectRatio w="100%" maxW={maxContainerWidth} ratio={1}>
        {isDisabled ? (
          <Center
            {...restBoxProps}
            cursor="not-allowed"
            opacity={0.5}
            bg="inputBg"
            _hover={{
              bg: "inputBgHover",
              borderColor: "blue.500",
            }}
            borderColor="inputBorder"
            borderWidth="1px"
          >
            <Stack align="center" color="gray.600">
              <Icon boxSize={6} as={FiUpload} />
              <Text color="gray.500">Upload Disabled</Text>
            </Stack>
          </Center>
        ) : (
          <Center
            {...restBoxProps}
            cursor="pointer"
            bg="inputBg"
            _hover={{
              bg: "inputBgHover",
              borderColor: "blue.500",
            }}
            borderColor="inputBorder"
            borderWidth="1px"
            {...getRootProps()}
            position="relative"
            overflow="hidden"
          >
            {noDisplay ? (
              <Stack align="center" color="gray.600">
                <Icon boxSize={6} as={FiImage} />
                <Text color="gray.600">{fileType} uploaded</Text>
              </Stack>
            ) : fileUrl ? (
              <Image
                top={0}
                left={0}
                position="absolute"
                w="100%"
                h="100%"
                src={fileUrl}
                objectFit="contain"
              />
            ) : (
              <Stack align="center" color="gray.600">
                <Icon boxSize={6} as={FiUpload} />
                <Text color="gray.600">Upload {helperText}</Text>
              </Stack>
            )}
            <input {...getInputProps()} />
          </Center>
        )}
      </AspectRatio>
      {showUploadButton || noDisplay ? (
        <Stack direction="column">
          {showUploadButton && (
            <Button
              leftIcon={<Icon as={AiOutlineFileAdd} />}
              onClick={open}
              colorScheme="purple"
              variant="outline"
            >
              Select File
            </Button>
          )}
          {noDisplay && (
            <Link href={fileUrl} isExternal textDecor="none !important">
              <Button
                leftIcon={<Icon as={AiFillEye} />}
                colorScheme="purple"
                variant="outline"
              >
                View File
              </Button>
            </Link>
          )}
        </Stack>
      ) : null}
    </Stack>
  );
};
