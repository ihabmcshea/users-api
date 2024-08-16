'use client'; // Ensure this component is treated as a client component

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Box, Spinner, Text } from '@chakra-ui/react';
import UpdateUserForm from 'app/components/UpdateUserForm';
import { useAuth } from 'app/context/AuthContext';
import useSWR from 'swr';
import withAuth from 'app/HOC/withAuth';


const fetcher = async (url: string, token: string) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user data';
    }
};

const UpdateUserPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Get the id from the route parameters
    const { token } = useAuth();

    const { data, error, isLoading } = useSWR(
        id ? [`/next-api/users/${id}`, token] : null,
        ([url, token]) => fetcher(url, token)
    );

    if (isLoading) {
        return (
            <Box textAlign="center" mt={4}>
                <Spinner />
                <Text mt={2}>Loading user data...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={4}>
                <Text color="red.500">Error: {error}</Text>
            </Box>
        );
    }

    const initialData = data;

    return (
        <Box>
            <Text fontSize="2xl" mb={4}>Update User</Text>
            {initialData && <UpdateUserForm userId={id} initialData={initialData} />}
        </Box>
    );
};

export default withAuth(UpdateUserPage, ['admin']);
