'use client';

import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Stack, Button } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import UserList from './UserList';
import Link from 'next/link';

const MainPage: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();


    if (isLoading) {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return (
            <Box textAlign="center" mt={10}>
                <Heading as="h2" mb={4}>Please log in</Heading>
            </Box>
        );
    }

    return (
        <Box p={5}>
            {user && user.role === 'user' ? (
                <Box>
                    <Heading as="h2" mb={4}>Your Profile</Heading>
                    <Box>
                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <Button mt={4} colorScheme="teal">Update Profile</Button>
                        <Button mt={4} ml={4} colorScheme="red">Delete Profile</Button>
                    </Box>
                </Box>
            ) : user && user.role === 'admin' ? (
                <Box>
                    <Heading as="h2" mb={4}>All Users</Heading>
                    <Link href="/createUser" passHref>
                        <Button mb={4} colorScheme="teal">Create User</Button>
                    </Link>
                    <UserList />
                </Box>
            ) : null}
        </Box>
    );
};

export default MainPage;
