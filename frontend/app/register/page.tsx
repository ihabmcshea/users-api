import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Box, Heading } from '@chakra-ui/react';

const RegisterPage: React.FC = () => {
    return (
        <Box p={4} maxW="md" mx="auto">
            <Heading as="h2" size="lg" mb={4}>
                Register
            </Heading>
            <RegisterForm />
        </Box>
    );
};

export default RegisterPage;
