import { useCallback, useRef, useState } from 'react';
import { Box, Icon, Image, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { uploadTaskImage } from '../services/storageService';

export function ImageUploader({ onUploaded }) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const user = useAuthStore((state) => state.user);
  const imageUrl = useWorkspaceStore((state) => state.imageUrl);
  const isUploading = useWorkspaceStore((state) => state.isUploading);
  const setImage = useWorkspaceStore((state) => state.setImage);
  const setIsUploading = useWorkspaceStore((state) => state.setIsUploading);

  const handleFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        toast({ title: 'Please upload an image file', status: 'warning' });
        return;
      }
      if (!user) return;

      setIsUploading(true);
      try {
        const downloadUrl = await uploadTaskImage(file, user.uid);
        setImage(file, downloadUrl);
        onUploaded?.(file, downloadUrl);
      } catch (error) {
        toast({ title: 'Upload failed', description: error.message, status: 'error' });
      } finally {
        setIsUploading(false);
      }
    },
    [user, setImage, setIsUploading, onUploaded, toast],
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  if (imageUrl) {
    return <Image src={imageUrl} alt="Task 1 upload" borderRadius="md" w="full" objectFit="contain" />;
  }

  return (
    <Box
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={isDragging ? 'teal.400' : 'gray.300'}
      bg={isDragging ? 'teal.50' : 'gray.50'}
      borderRadius="lg"
      p={10}
      textAlign="center"
      cursor="pointer"
      transition="all 0.15s"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <VStack spacing={3}>
        {isUploading ? (
          <Spinner color="teal.500" />
        ) : (
          <Icon as={FiUploadCloud} boxSize={10} color="teal.500" />
        )}
        <Text fontWeight="medium">
          {isUploading ? 'Uploading...' : 'Drag & drop your Task 1 image, or click to browse'}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Chart, graph, map, or process diagram (PNG/JPG)
        </Text>
      </VStack>
    </Box>
  );
}
