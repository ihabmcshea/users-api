'use-client'
import React, { useState } from 'react';
import { Box, Button, Flex, Text, IconButton, useToast, Td, Tr } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { IUser } from 'app/interfaces/IUser';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useAuth } from 'app/context/AuthContext';

interface UserItemProps {
    user: IUser;
    page: number;
}

const User: React.FC<UserItemProps> = ({ user, page }) => {
    const { token } = useAuth();
    const { mutate } = useSWRConfig();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toast = useToast();

    // const handleDelete = async () => {
    //     try {
    //         await axios.delete(`/api/v1/users`, {
    //             data: { id: user.id },
    //         });
    //         toast({
    //             title: 'User deleted.',
    //             status: 'success',
    //             duration: 2000,
    //             isClosable: true,
    //         });
    //         mutate('/api/v1/users'); // Trigger revalidation
    //     } catch (error) {
    //         console.error('Failed to delete user', error);
    //         toast({
    //             title: 'Failed to delete user.',
    //             status: 'error',
    //             duration: 2000,
    //             isClosable: true,
    //         });
    //     }
    // };


    const handleDelete = async () => {
        try {
            await axios.delete('next-api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { id: user.id },
            });
            toast({
                title: 'User deleted.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            mutate(`next-api/users`); // Trigger revalidation
        } catch (error) {
            console.error('Failed to delete user', error);
            toast({
                title: 'Failed to delete user.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        } finally {
            setIsModalOpen(false);
        }
    };


    return (
        <>
            <Tr>
                <Td>
                    {user.firstName}
                </Td>
                <Td>
                    {user.lastName}
                </Td>
                <Td>
                    {user.email}
                </Td>
                <Td>
                    {new Date(user.createdAt).toLocaleDateString()}
                </Td>

                <Td>
                    <Flex>
                        <IconButton
                            aria-label="Edit user"
                            icon={<EditIcon />}
                            mr={2}
                        />
                        <IconButton
                            aria-label="Delete user"
                            icon={<DeleteIcon />}
                            onClick={() => setIsModalOpen(true)}
                            colorScheme="red"
                        />
                    </Flex>
                </Td>
            </Tr>

            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default User;
