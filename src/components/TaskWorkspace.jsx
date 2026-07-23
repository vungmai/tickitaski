import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { FiCheckCircle, FiLock } from 'react-icons/fi';
import { useWorkspaceStore, WORKSPACE_STEPS } from '../store/useWorkspaceStore';
import { ImageUploader } from './ImageUploader';
import { generateStrategyFromImage, evaluateEssay } from '../services/aiService';

const MIN_WORDS = 150;

function useElapsedTime(startedAt) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startedAt) return undefined;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const seconds = String(elapsedSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function TaskWorkspace() {
  const toast = useToast();
  const step = useWorkspaceStore((state) => state.step);
  const imageFile = useWorkspaceStore((state) => state.imageFile);
  const hints = useWorkspaceStore((state) => state.hints);
  const sampleAnswer = useWorkspaceStore((state) => state.sampleAnswer);
  const hintsVisible = useWorkspaceStore((state) => state.hintsVisible);
  const isGeneratingStrategy = useWorkspaceStore((state) => state.isGeneratingStrategy);
  const essayText = useWorkspaceStore((state) => state.essayText);
  const sessionStartedAt = useWorkspaceStore((state) => state.sessionStartedAt);
  const evaluation = useWorkspaceStore((state) => state.evaluation);
  const isEvaluating = useWorkspaceStore((state) => state.isEvaluating);

  const setIsGeneratingStrategy = useWorkspaceStore((state) => state.setIsGeneratingStrategy);
  const setStrategy = useWorkspaceStore((state) => state.setStrategy);
  const toggleHintsVisible = useWorkspaceStore((state) => state.toggleHintsVisible);
  const setEssayText = useWorkspaceStore((state) => state.setEssayText);
  const startSession = useWorkspaceStore((state) => state.startSession);
  const setIsEvaluating = useWorkspaceStore((state) => state.setIsEvaluating);
  const setEvaluation = useWorkspaceStore((state) => state.setEvaluation);

  const elapsedTime = useElapsedTime(sessionStartedAt);
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const isSampleUnlocked = Boolean(evaluation);

  const handleImageUploaded = async (file) => {
    setIsGeneratingStrategy(true);
    try {
      const strategy = await generateStrategyFromImage(file);
      setStrategy(strategy);
    } catch (error) {
      toast({ title: 'Could not generate strategy', description: error.message, status: 'error' });
      setIsGeneratingStrategy(false);
    }
  };

  const handleEssayChange = (event) => {
    if (!sessionStartedAt) startSession();
    setEssayText(event.target.value);
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluateEssay(essayText, hints);
      setEvaluation(result);
    } catch (error) {
      toast({ title: 'Evaluation failed', description: error.message, status: 'error' });
      setIsEvaluating(false);
    }
  };

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} p={6}>
      <GridItem>
        <ImageUploader onUploaded={handleImageUploaded} />

        {imageFile && (
          <Box mt={4}>
            <Button size="sm" variant="outline" onClick={toggleHintsVisible} isDisabled={!hints}>
              {hintsVisible ? 'Hide Hints' : 'Show Hints'}
            </Button>

            {isGeneratingStrategy && (
              <HStack mt={3} color="gray.500">
                <Spinner size="sm" />
                <Text>Analyzing image and preparing strategy...</Text>
              </HStack>
            )}

            <Collapse in={hintsVisible && Boolean(hints)}>
              <Box mt={3} p={4} bg="teal.50" borderRadius="md">
                <Heading size="sm" mb={2}>
                  Strategy Tips
                </Heading>
                <List spacing={2}>
                  {hints?.map((hint, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiCheckCircle} color="teal.500" />
                      {hint}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>

            <Box mt={4} p={4} borderRadius="md" borderWidth="1px" opacity={isSampleUnlocked ? 1 : 0.6}>
              <HStack mb={2}>
                <Heading size="sm">Sample Answer (Band 8.0+)</Heading>
                {!isSampleUnlocked && <ListIcon as={FiLock} color="gray.400" />}
              </HStack>
              {isSampleUnlocked ? (
                <Text whiteSpace="pre-wrap">{sampleAnswer}</Text>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Submit your essay to unlock the sample answer.
                </Text>
              )}
            </Box>
          </Box>
        )}
      </GridItem>

      <GridItem>
        <HStack justify="space-between" mb={2}>
          <Badge colorScheme={wordCount >= MIN_WORDS ? 'green' : 'orange'}>
            {wordCount} / {MIN_WORDS}+ words
          </Badge>
          <Text fontSize="sm" color="gray.500">
            Session time: {elapsedTime}
          </Text>
        </HStack>

        <Textarea
          value={essayText}
          onChange={handleEssayChange}
          placeholder="Write your Task 1 essay here (150+ words)..."
          minH="400px"
          isDisabled={step === WORKSPACE_STEPS.FEEDBACK}
        />

        <Divider my={4} />

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          isLoading={isEvaluating}
          isDisabled={wordCount < MIN_WORDS || isSampleUnlocked}
        >
          Submit for Evaluation
        </Button>
      </GridItem>
    </Grid>
  );
}
