'use client';

import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Avatar, Box, Text, Flex } from '@chakra-ui/react';

import { useAuth } from '../context/AuthContext';

const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
                <Flex alignItems="center">
                    <Box ml="2">
                        <Text>
                            w
                            {JSON.stringify(user)}
                            {user?.firstName}</Text>
                    </Box>
                </Flex>
            </MenuButton>
            <MenuList>
                <MenuItem onClick={() => (window.location.href = '/profile')}>Profile</MenuItem>
                <MenuItem onClick={() => (window.location.href = '/settings')}>Settings</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default UserMenu;
