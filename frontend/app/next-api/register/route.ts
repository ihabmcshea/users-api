import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log(data);
        const response = await axios.post('http://backend:4000/api/v1/auth/register', data);
        return NextResponse.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
