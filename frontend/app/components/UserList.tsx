import React, { useState } from 'react';
import useSWR from 'swr';
import { Box, Table, Tbody, Td, Th, Thead, Tr, IconButton, Spinner, Flex, Button } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { IUser } from 'app/interfaces/IUser';
import { useAuth } from 'app/context/AuthContext';
import { PagintedUsers } from 'app/interfaces/IPaginatedUsers';
import User from './User';


const fetcher = (url: string, token: string | undefined) => axios.get(url, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
}).then((res) => res.data);




const UserList: React.FC = () => {
    const { token } = useAuth();
    const [page, setPage] = useState(1);

    const { data, error } = useSWR<PagintedUsers>(
        [`/next-api/users?page=${page}`, token],
        ([url, token]) => fetcher(url, token)
    );


    if (error) return <Box>Error loading users</Box>;
    if (!data) return <div><Spinner /></div>;

    const { data: users, meta } = data;

    const handleNextPage = () => {
        console.log(page, meta.totalPages);
        if (page < meta.totalPages) setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <Flex direction="column" p={8} width="100%">
            <Box flex="1" overflowX="auto">
                <Table variant="simple" width="100%">
                    <Thead>
                        <Tr>
                            <Th>First Name</Th>
                            <Th>Last Name</Th>
                            <Th>Email</Th>
                            <Th>Registration Date</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user: IUser) => (
                            <User key={user.id} user={user} page={page} />
                        ))
                        }
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
