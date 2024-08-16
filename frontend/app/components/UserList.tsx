'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Box, Table, Tbody, Td, Th, Thead, Tr, IconButton, Spinner, Flex, Button, useBreakpointValue } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { IUser } from 'app/interfaces/IUser';
import { PaginatedUsers } from 'app/interfaces/IPaginatedUsers';
import User from './User';
import { useAuth } from 'app/context/AuthContext';

// Define a fetcher function
const fetcher = (url: string, token: string | undefined) =>
    axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.data);

const UserList: React.FC = () => {
    const { token } = useAuth();
    const [page, setPage] = useState(1);

    const { data, error } = useSWR<PaginatedUsers>(
        [`/next-api/users?page=${page}`, token],
        ([url, token]) => fetcher(url, token)
    );

    if (error) return <Box>Error loading users</Box>;
    if (!data) return <Flex justify="center" align="center" height="100vh"><Spinner size="lg" /></Flex>;

    const { data: users, meta } = data;

    const handleNextPage = () => {
        if (page < meta.totalPages) setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <Flex direction="column" p={4} width="100%">
            <Box overflowX="auto">
                <Table variant="simple" width="100%">
                    <Thead>
                        <Tr>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Email</Th>
                            <Th>User Role</Th>
                            <Th>Registration Date</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user: IUser) => (
                            <User key={user.id} user={user} page={page} />
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <Flex justify="space-between" mt={4}>
                <Button
                    onClick={handlePreviousPage}
                    isDisabled={page <= 1}
                >
                    Previous
                </Button>
                <Button
                    onClick={handleNextPage}
                    isDisabled={page >= meta.totalPages}
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    );
};

export default UserList;
