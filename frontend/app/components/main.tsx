'use client';

import React from 'react';
import { Box, Heading, Spinner, Stack, Button, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import UserList from './UserList';
import Link from 'next/link';

const MainPage: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Show loading spinner while auth status is being determined
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="lg" />
            </Box>
        );
    }

    // Show login prompt if user is not authenticated
    if (!isAuthenticated) {
        return (
            <Box textAlign="center" mt={10}>
                <Heading as="h2" mb={4}>Please log in</Heading>
                <Link href="/login" passHref>
                    <Button colorScheme="teal" size="lg">Login</Button>
                </Link>
            </Box>
        );
    }

    // Render content based on user role
    return (
        <Box p={5} maxW="container.lg" mx="auto">
            {user.role === 'user' ? (
                <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
                    <Heading as="h2" mb={4} size="lg">Your Profile</Heading>
                    <Stack spacing={4}>
                        <Text><strong>Name:</strong> {user.firstName} {user.lastName}</Text>
                        <Text><strong>Email:</strong> {user.email}</Text>
                        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                            <Link href="/profile" passHref>
                                <Button colorScheme="teal" width="full" size="md">Update Profile</Button>
                            </Link>
                            <Button colorScheme="red" width="full" size="md">Delete Profile</Button>
                        </Stack>
                    </Stack>
                </Box>
            ) : user.role === 'admin' ? (
                <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
                    <Heading as="h2" mb={4} size="lg">All Users</Heading>
                    <Link href="/createUser" passHref>
                        <Button colorScheme="teal" mb={4} size="md">Create User</Button>
                    </Link>
                    <UserList />
                </Box>
            ) : null}
        </Box>
    );
};

export default MainPage;
