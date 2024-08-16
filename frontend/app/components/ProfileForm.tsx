'use client'; // Ensure this component is treated as a client component

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Box, Select, useToast } from '@chakra-ui/react';
import { useAuth } from 'app/context/AuthContext';

interface FormData {
    email: string;
    firstName: string;
    lastName: string;
}

interface UpdateUserFormProps {
    initialData: FormData & { id: string; updatedAt: string; createdAt: string };
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ initialData }) => {
    const { token } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            email: initialData.email,
            firstName: initialData.firstName,
            lastName: initialData.lastName,
        },
    });
    const toast = useToast();

    const onSubmit = async (data: FormData) => {
        try {
            // Filter out fields that should not be included in the update request
            const { ...updateData } = data;

            await axios.put(`/next-api/users/profile`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


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


            <Button type="submit" mt={4}>Update User</Button>
        </Box>
    );
};

export default React.memo(UpdateUserForm);
