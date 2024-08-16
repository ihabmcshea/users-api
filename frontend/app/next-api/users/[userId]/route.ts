import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { NextResponse } from 'next/server';



export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { userId } = params;
    const body = await request.json();
    try {
        const token = request.headers.get('authorization');

        if (!token) {
                return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const response = await axios.put(`http://backend:4000/api/v1/users/${userId}`, body, {
            headers: {
                Authorization: token,
            },
        });

                return NextResponse.json({...response.data}, {status: 200});

        // res.status(response.status).json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { message: 'An error occurred while updating the user.' };
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = params;
console.log('userId', userId);
    try {
        const token = request.headers.get('authorization');
        if (!token) {
                return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const response = await axios.get(`http://backend:4000/api/v1/users/${userId}`, {
            headers: {
                Authorization: token,
            },
        });

        // console.log('response-11100', response);
                        return NextResponse.json(response.data);

        // res.status(response.status).json(response.data);
    } catch (error) {
        console.log('error---11000', error);
        // const status = error.response?.status || 500;
                        return NextResponse.json({message: "Can't load user"}, {status: 401});

        // const data = error.response?.data || { message: 'An error occurred while retrieving the user.' };
        // res.status(status).json(data);
    }
}
