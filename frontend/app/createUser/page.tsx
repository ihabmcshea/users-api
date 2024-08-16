import React from 'react';
import UserCreationForm from '../components/UserCreationForm';
import { Box, Heading } from '@chakra-ui/react';

const UserCreationPage: React.FC = () => {
    return (
        <Box p={4} maxW="md" mx="auto">
            <Heading as="h2" size="lg" mb={4}>
                Create New User
            </Heading>
            <UserCreationForm />
        </Box>
    );
};

export default UserCreationPage;
