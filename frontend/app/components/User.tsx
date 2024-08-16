'use client';

import React, { useState, useCallback } from 'react';
import { Box, Button, Flex, Text, IconButton, useToast, Td, Tr } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { IUser } from 'app/interfaces/IUser';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useAuth } from 'app/context/AuthContext';
import Link from 'next/link';

interface UserItemProps {
    user: IUser;
    page: number;
}

const User: React.FC<UserItemProps> = ({ user, page }) => {
    const { token } = useAuth();
    const { mutate } = useSWRConfig();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toast = useToast();

    // Memoize the handleDelete function to avoid unnecessary re-renders
    const handleDelete = useCallback(async () => {
        try {
            await axios.delete('/next-api/users', {
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
            // Trigger revalidation for the current page
            mutate([`/next-api/users?page=${page}`, token]);
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
    }, [token, user.id, page, toast, mutate]);

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
                    {user.role}
                </Td>
                <Td>
                    {new Date(user.createdAt).toLocaleDateString()}
                </Td>
                <Td>
                    <Flex>
                        <Link href={`/updateUser/${user.id}`} passHref>
                            <IconButton
                                aria-label="Edit user"
                                icon={<EditIcon />}
                                mr={2}
                                variant="outline"
                            />
                        </Link>
                        <IconButton
                            aria-label="Delete user"
                            icon={<DeleteIcon />}
                            onClick={() => setIsModalOpen(true)}
                            colorScheme="red"
                            variant="outline"
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
