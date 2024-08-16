'use client'
import React from 'react';
import { Box, Heading, Text, Button, useBreakpointValue, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { WarningIcon } from '@chakra-ui/icons';

const UnauthorizedPage: React.FC = () => {
    const router = useRouter();
    const headingSize = useBreakpointValue({ base: 'lg', md: 'xl' });
    const textSize = useBreakpointValue({ base: 'md', md: 'lg' });
    const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
            p={4}
        >
            <Icon as={WarningIcon} boxSize="50px" color="red.500" mb={4} />
            <Heading as="h1" size={headingSize} mb={4}>
                Access Denied
            </Heading>
            <Text fontSize={textSize} mb={6}>
                You do not have permission to view this page. Please contact your administrator if you believe this is an error.
            </Text>
            <Button
                colorScheme="teal"
                size={buttonSize}
                onClick={() => router.push('/')}
            >
                Go Home
            </Button>
        </Box>
    );
};

export default UnauthorizedPage;
