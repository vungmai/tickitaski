import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/useAuthStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { saveAttempt } from '../services/firestoreService';

const CRITERIA_LABELS = {
  taskAchievement: 'Task Achievement',
  coherenceCohesion: 'Coherence & Cohesion',
  lexicalResource: 'Lexical Resource',
  grammaticalRange: 'Grammatical Range & Accuracy',
};

export function EvaluationReport() {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const user = useAuthStore((state) => state.user);
  const evaluation = useWorkspaceStore((state) => state.evaluation);
  const imageUrl = useWorkspaceStore((state) => state.imageUrl);
  const hints = useWorkspaceStore((state) => state.hints);
  const sampleAnswer = useWorkspaceStore((state) => state.sampleAnswer);
  const essayText = useWorkspaceStore((state) => state.essayText);
  const notes = useWorkspaceStore((state) => state.notes);
  const setNotes = useWorkspaceStore((state) => state.setNotes);
  const resetWorkspace = useWorkspaceStore((state) => state.resetWorkspace);

  if (!evaluation) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAttempt(user.uid, {
        imageUrl,
        hints,
        sampleAnswer,
        essayText,
        evaluation,
        notes,
      });
      toast({ title: 'Attempt saved', status: 'success' });
    } catch (error) {
      toast({ title: 'Save failed', description: error.message, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={6} borderTopWidth="1px">
      <Heading size="md" mb={4}>
        Evaluation Report
      </Heading>

      <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(5, 1fr)' }} gap={4} mb={6}>
        <Stat p={4} borderRadius="md" bg="teal.50">
          <StatLabel>Overall Band</StatLabel>
          <StatNumber color="teal.600">{evaluation.overallBand}</StatNumber>
        </Stat>
        {Object.entries(CRITERIA_LABELS).map(([key, label]) => (
          <Stat key={key} p={4} borderRadius="md" bg="gray.50">
            <StatLabel fontSize="xs">{label}</StatLabel>
            <StatNumber fontSize="xl">{evaluation.criteria?.[key] ?? '-'}</StatNumber>
          </Stat>
        ))}
      </Grid>

      <Stack spacing={4} mb={6}>
        {Object.entries(CRITERIA_LABELS).map(([key, label]) => (
          <Box key={key}>
            <Heading size="sm" mb={1}>
              {label}
            </Heading>
            <Text color="gray.600">{evaluation.feedback?.[key]}</Text>
          </Box>
        ))}
        {evaluation.feedback?.summary && (
          <Box>
            <Heading size="sm" mb={1}>
              Overall Feedback
            </Heading>
            <Text color="gray.600">{evaluation.feedback.summary}</Text>
          </Box>
        )}
      </Stack>

      <Box mb={6}>
        <Heading size="sm" mb={2}>
          Your Notes
        </Heading>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add personal notes about this attempt..."
        />
      </Box>

      <HStack>
        <Button colorScheme="teal" onClick={handleSave} isLoading={isSaving}>
          Save Attempt
        </Button>
        <Button variant="outline" onClick={resetWorkspace}>
          New Task
        </Button>
      </HStack>
    </Box>
  );
}
