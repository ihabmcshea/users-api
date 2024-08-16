'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Box, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const RegisterForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [backendErrors, setBackendErrors] = useState<{ [key: string]: string }>({});
    const toast = useToast();
    const router = useRouter();

    // Improved function signature
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            await axios.post('/next-api/register', data);

            toast({
                title: "Registration successful! Please check your email for confirmation code.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorData = error.response.data;
                setBackendErrors({
                    ...errorData.errors, // Backend error handling
                    general: errorData.message || 'Registration failed. Please try again.',
                });
            } else {
                setBackendErrors({ general: 'Registration failed. Please try again.' });
            }
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4} maxW="md" mx="auto">
            {/* Display general backend errors */}
            {backendErrors.general && (
                <Box color="red.500" mb={4}>
                    {backendErrors.general}
                </Box>
            )}

            {/* Email Input */}
            <FormControl isInvalid={!!errors.email || !!backendErrors.email} mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                />
                <FormErrorMessage>
                    {errors.email?.message || backendErrors.email}
                </FormErrorMessage>
            </FormControl>

            {/* First Name Input */}
            <FormControl isInvalid={!!errors.firstName || !!backendErrors.firstName} mb={4}>
                <FormLabel>First Name</FormLabel>
                <Input
                    {...register('firstName', { required: 'First name is required' })}
                />
                <FormErrorMessage>
                    {errors.firstName?.message || backendErrors.firstName}
                </FormErrorMessage>
            </FormControl>

            {/* Last Name Input */}
            <FormControl isInvalid={!!errors.lastName || !!backendErrors.lastName} mb={4}>
                <FormLabel>Last Name</FormLabel>
                <Input
                    {...register('lastName', { required: 'Last name is required' })}
                />
                <FormErrorMessage>
                    {errors.lastName?.message || backendErrors.lastName}
                </FormErrorMessage>
            </FormControl>

            {/* Password Input */}
            <FormControl isInvalid={!!errors.password || !!backendErrors.password} mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                />
                <FormErrorMessage>
                    {errors.password?.message || backendErrors.password}
                </FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">Register</Button>
        </Box>
    );
};

export default RegisterForm;
