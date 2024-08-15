'use client';

import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Stack, Button } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MainPage: React.FC = () => {
    const { user, isAuthenticated, isLoading, token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                // Fetch all users for admin
                const fetchUsers = async () => {
                    try {
                        const response = await axios.get('/next-api/users', { // Updated route
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setUsers(response.data);
                    } catch (error) {
                        console.error('Failed to fetch users', error);
                    } finally {
                        setIsFetching(false);
                    }
                };
                fetchUsers();
            } else {
                // No action needed for non-admin users
                setIsFetching(false);
            }
        } else {
            setIsFetching(false);
        }
    }, [isAuthenticated, user, token]);

    if (isLoading || isFetching) {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return (
            <Box textAlign="center" mt={10}>
                <Heading as="h2" mb={4}>Please log in</Heading>
                {/* This can be a button or a link to login */}
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
                    <Button mb={4} colorScheme="teal">Create User</Button>
                    {users.length ? (
                        <Stack spacing={4}>
                            {users.map((u) => (
                                <Box key={u.id} p={4} borderWidth={1} borderRadius="md">
                                    <p><strong>Name:</strong> {u.firstName} {u.lastName}</p>
                                    <p><strong>Email:</strong> {u.email}</p>
                                    <Button colorScheme="teal" mr={2}>Update</Button>
                                    <Button colorScheme="red">Delete</Button>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <p>No users found</p>
                    )}
                </Box>
            ) : null}
        </Box>
    );
};

export default MainPage;
