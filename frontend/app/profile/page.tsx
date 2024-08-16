"use client"
import useSWR from 'swr';
import ProfileForm from '../components/ProfileForm';
import axios from 'axios';
import { useAuth } from 'app/context/AuthContext';
import { IUserProfile } from 'app/interfaces/IUserProfile';
import { useToast } from '@chakra-ui/react';
import withAuth from 'app/HOC/withAuth';


const fetcher = async (url: string, token: string) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user data';
    }
};
const Profile = () => {
    const { token } = useAuth();
    const toast = useToast();
    const { data: user, error, isLoading } = useSWR(
        [`/next-api/users/profile`, token],
        ([url, token]) => fetcher(url, token)
    );

    if (error) return <div>Error loading profile</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <ProfileForm initialData={user} />
    );
};

export default withAuth(Profile, ["user"]);
