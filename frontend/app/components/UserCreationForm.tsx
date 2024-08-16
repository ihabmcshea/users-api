'use client';
import React, { useCallback, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage, Box, useToast } from '@chakra-ui/react';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
}

const CreateUserForm: React.FC = () => {
    const { token } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
    const toast = useToast();
    const router = useRouter();

    const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
        try {
            await axios.post('/next-api/users', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast({
                title: "User created.",
                description: "The user has been successfully created.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            reset(); // Reset form fields
            setTimeout(() => router.push('/'), 2000);
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.statusCode === 400) {
                setBackendErrors({
                    firstName: errorData.firstName || '',
                    lastName: errorData.lastName || '',
                    email: errorData.email || '',
                    password: errorData.password || '',
                    role: errorData.role || '',
                    general: errorData.general || 'User creation failed. Please try again.',
                });
            } else {
                setBackendErrors({ general: 'User creation failed. Please try again.' });
            }
        }
    }, [token, router, reset, toast]);

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
            <FormControl isInvalid={!!errors.email || !!backendErrors.email}>
                <FormLabel>Email</FormLabel>
                <Input {...register('email', { required: 'Email is required' })} />
                <FormErrorMessage>{errors.email?.message || backendErrors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password || !!backendErrors.password}>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register('password', { required: 'Password is required' })} />
                <FormErrorMessage>{errors.password?.message || backendErrors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.firstName || !!backendErrors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input {...register('firstName', { required: 'First name is required' })} />
                <FormErrorMessage>{errors.firstName?.message || backendErrors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName || !!backendErrors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input {...register('lastName', { required: 'Last name is required' })} />
                <FormErrorMessage>{errors.lastName?.message || backendErrors.lastName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.role || !!backendErrors.role}>
                <FormLabel>Role</FormLabel>
                <Select {...register('role', { required: 'Role is required' })}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </Select>
                <FormErrorMessage>{errors.role?.message || backendErrors.role}</FormErrorMessage>
            </FormControl>

            <Button type="submit" mt={4} colorScheme="teal">Create User</Button>
        </Box>
    );
};

export default CreateUserForm;
