import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Center,
  Grid,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/useAuthStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { fetchAttemptsForUser } from '../services/firestoreService';

export function HistoryPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const user = useAuthStore((state) => state.user);
  const attempts = useHistoryStore((state) => state.attempts);
  const isLoading = useHistoryStore((state) => state.isLoading);
  const selectedAttempt = useHistoryStore((state) => state.selectedAttempt);
  const setAttempts = useHistoryStore((state) => state.setAttempts);
  const setIsLoading = useHistoryStore((state) => state.setIsLoading);
  const setError = useHistoryStore((state) => state.setError);
  const selectAttempt = useHistoryStore((state) => state.selectAttempt);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    fetchAttemptsForUser(user.uid)
      .then(setAttempts)
      .catch((error) => setError(error.message));
  }, [user, setAttempts, setIsLoading, setError]);

  const visibleAttempts = useMemo(() => {
    let list = attempts.filter((attempt) =>
      attempt.essayText?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    list = [...list].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? 0;
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return list;
  }, [attempts, searchTerm, sortOrder]);

  const handleOpenAttempt = (attempt) => {
    selectAttempt(attempt);
    onOpen();
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Practice History
      </Heading>

      <Stack direction={{ base: 'column', sm: 'row' }} mb={6} spacing={3}>
        <Input
          placeholder="Search by essay content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="sm"
        />
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} maxW="200px">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </Stack>

      {isLoading ? (
        <Center py={10}>
          <Spinner color="teal.500" />
        </Center>
      ) : visibleAttempts.length === 0 ? (
        <Text color="gray.500">No saved attempts yet. Complete a practice session to see it here.</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={5}>
          {visibleAttempts.map((attempt) => (
            <Box
              key={attempt.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              _hover={{ boxShadow: 'md' }}
              onClick={() => handleOpenAttempt(attempt)}
            >
              <Image src={attempt.imageUrl} alt="Task 1" h="140px" w="full" objectFit="cover" />
              <Box p={3}>
                <Badge colorScheme="teal">Band {attempt.evaluation?.overallBand ?? '-'}</Badge>
                <Text mt={2} noOfLines={2} fontSize="sm" color="gray.600">
                  {attempt.essayText}
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attempt Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAttempt && (
              <Stack spacing={4}>
                <Image src={selectedAttempt.imageUrl} alt="Task 1" borderRadius="md" />
                <Badge colorScheme="teal" w="fit-content">
                  Overall Band {selectedAttempt.evaluation?.overallBand ?? '-'}
                </Badge>
                <Box>
                  <Heading size="sm" mb={1}>
                    Your Essay
                  </Heading>
                  <Text whiteSpace="pre-wrap">{selectedAttempt.essayText}</Text>
                </Box>
                <Box>
                  <Heading size="sm" mb={1}>
                    Feedback Summary
                  </Heading>
                  <Text whiteSpace="pre-wrap" color="gray.600">
                    {selectedAttempt.evaluation?.feedback?.summary}
                  </Text>
                </Box>
                <Box>
                  <Heading size="sm" mb={1}>
                    Sample Answer
                  </Heading>
                  <Text whiteSpace="pre-wrap" color="gray.600">
                    {selectedAttempt.sampleAnswer}
                  </Text>
                </Box>
                {selectedAttempt.notes && (
                  <Box>
                    <Heading size="sm" mb={1}>
                      Your Notes
                    </Heading>
                    <Text whiteSpace="pre-wrap" color="gray.600">
                      {selectedAttempt.notes}
                    </Text>
                  </Box>
                )}
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
