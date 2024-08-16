'use client';

import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Avatar, Text, Flex, useColorMode } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
    isMobile: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isMobile }) => {
    const { user, logout } = useAuth();
    const { colorMode, setColorMode } = useColorMode();
    const userName = user?.firstName || "User";

    const handleColorModeToggle = () => {
        setColorMode(colorMode === 'light' ? 'dark' : 'light');
    };

    const buttonColorScheme = 'teal';
    const menuBgColor = colorMode === 'light' ? 'gray.100' : 'gray.800';
    const menuTextColor = colorMode === 'light' ? 'black' : 'white';

    return (
        <Flex align="center" direction={isMobile ? 'column' : 'row'} p={2}>
            {isMobile ? (
                <Flex direction="column" align="center">
                    <Avatar name={userName} size="md" mb={2} />
                    <Text fontWeight="bold" mb={2}>{userName}</Text>
                    <Button onClick={handleColorModeToggle} colorScheme={buttonColorScheme} mb={2}>
                        Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
                    </Button>
                    <Button onClick={logout} colorScheme={buttonColorScheme}>
                        Logout
                    </Button>
                </Flex>
            ) : (
                <Menu>
                    <MenuButton
                        as={Button}
                        colorScheme={buttonColorScheme}
                        rounded="full"
                        px={4}
                        py={2}
                        _hover={{ bg: `${buttonColorScheme}.600`, color: 'white' }}
                    >
                        <Flex align="center">
                            <Avatar name={userName} size="sm" mr={2} />
                            <Text fontWeight="bold" color={menuTextColor}>
                                {userName}
                            </Text>
                        </Flex>
                    </MenuButton>
                    <MenuList bg={menuBgColor} color={menuTextColor}>
                        <MenuItem onClick={handleColorModeToggle} _hover={{ bg: `${buttonColorScheme}.600`, color: 'white' }}>
                            Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
                        </MenuItem>
                        <MenuItem onClick={logout} _hover={{ bg: `${buttonColorScheme}.600`, color: 'white' }}>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            )}
        </Flex>
    );
};

export default UserMenu;
