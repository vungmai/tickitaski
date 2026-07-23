import { Box } from '@chakra-ui/react';
import { TaskWorkspace } from '../components/TaskWorkspace';
import { EvaluationReport } from '../components/EvaluationReport';

export function WorkspacePage() {
  return (
    <Box>
      <TaskWorkspace />
      <EvaluationReport />
    </Box>
  );
}
