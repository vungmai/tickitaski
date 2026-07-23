import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, HStack, Heading, Button, Link, Avatar, Spacer } from '@chakra-ui/react';
import { useAuthStore } from '../store/useAuthStore';
import { signOutUser } from '../services/authService';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/auth');
  };

  return (
    <Box borderBottomWidth="1px" bg="white" px={6} py={3}>
      <Flex align="center">
        <Heading as={RouterLink} to="/" size="md" color="teal.600">
          TickiTaski
        </Heading>

        <HStack spacing={6} ml={10}>
          <Link as={RouterLink} to="/" fontWeight="medium">
            Workspace
          </Link>
          <Link as={RouterLink} to="/history" fontWeight="medium">
            History
          </Link>
        </HStack>

        <Spacer />

        {user ? (
          <HStack spacing={4}>
            <Avatar size="sm" name={user.displayName || user.email} src={user.photoURL} />
            <Button size="sm" variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </HStack>
        ) : (
          <Button as={RouterLink} to="/auth" size="sm" colorScheme="teal">
            Sign in
          </Button>
        )}
      </Flex>
    </Box>
  );
}
