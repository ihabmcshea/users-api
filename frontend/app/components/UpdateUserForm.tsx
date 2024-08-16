'use client'; // Ensure this component is treated as a client component

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Box, Select, useToast } from '@chakra-ui/react';
import { useAuth } from 'app/context/AuthContext';

interface FormData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
}

interface UpdateUserFormProps {
    userId: string;
    initialData: FormData & { id: string; updatedAt: string; createdAt: string };
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ userId, initialData }) => {
    const { token } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            email: initialData.email,
            firstName: initialData.firstName,
            lastName: initialData.lastName,
            role: initialData.role,
            password: '', // Default value for password field
        },
    });
    const toast = useToast();

    const onSubmit = async (data: FormData) => {
        try {
            // Filter out fields that should not be included in the update request
            const { password, ...updateData } = data;

            // Ignore the password field if it's empty
            if (!password) {
                // Only send fields that are present and not empty
                await axios.put(`/next-api/users/${userId}`, updateData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.put(`/next-api/users/${userId}`, { ...updateData, password }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            toast({
                title: "User updated successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || 'User update failed. Please try again.'
                : 'User update failed. Please try again.';

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
            <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.role}>
                <FormLabel>Role</FormLabel>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select {...field}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </Select>
                    )}
                />
                <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <Input type="password" {...field} placeholder="Leave empty to keep current password" />}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" mt={4}>Update User</Button>
        </Box>
    );
};

export default React.memo(UpdateUserForm);
