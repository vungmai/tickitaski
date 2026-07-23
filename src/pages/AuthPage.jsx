import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '../services/authService';

export function AuthPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthError = (error) => {
    toast({ title: 'Authentication failed', description: error.message, status: 'error' });
  };

  const withSubmitting = async (fn) => {
    setIsSubmitting(true);
    try {
      await fn();
      navigate('/');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Center minH="80vh" px={4}>
      <Box w="full" maxW="sm" borderWidth="1px" borderRadius="lg" p={8} boxShadow="sm">
        <Heading size="lg" mb={1} textAlign="center" color="teal.600">
          TickiTaski
        </Heading>
        <Text mb={6} textAlign="center" color="gray.500">
          IELTS Writing Task 1 Practice
        </Text>

        <Tabs isFitted colorScheme="teal" mb={6}>
          <TabList>
            <Tab>Log In</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Stack spacing={3}>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={() => withSubmitting(() => signInWithEmail(email, password))}
                >
                  Log In
                </Button>
              </Stack>
            </TabPanel>
            <TabPanel px={0}>
              <Stack spacing={3}>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password (min 6 characters)"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={() => withSubmitting(() => signUpWithEmail(email, password))}
                >
                  Sign Up
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Divider mb={6} />

        <Button
          w="full"
          variant="outline"
          leftIcon={<FcGoogle />}
          isLoading={isSubmitting}
          onClick={() => withSubmitting(signInWithGoogle)}
        >
          Continue with Google
        </Button>
      </Box>
    </Center>
  );
}
