import axios from 'axios';
import { NextResponse } from 'next/server';
axios.interceptors.request.use((request) => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

export async function POST(request: Request) {
  try {
    // Extract data from the request
    const { firstName, lastName, email, password, role } = await request.json();
    const authorization = request.headers?.get('Authorization');

    // Send request to the NestJS backend
    const response = await axios.post(
      `http://backend:4000/api/v1/users`,
      { firstName, lastName, email, password, role },
      {headers: {
        Authorization: authorization
      }}
    );

    // Return the successful response from the backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error during user creation:', error.response);

    // Extract error message from the response

    // Return a formatted error response
    if(error.response.data){
    return NextResponse.json(error.response.data, {status: 400});
    }
  }
}


export async function GET(request: Request) {
const authorization = request.headers?.get('Authorization');
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  try {
    const { data } = await axios.get(`http://backend:4000/api/v1/users`, {
      headers: {
        "Authorization": authorization
      },
      params:{
        page,
        limit:10
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function DELETE(request: Request) {
    try {
    const { id } = await request.json();
    const authorization = request.headers?.get('Authorization');
    const response = await axios.delete(
      `http://backend:4000/api/v1/users/${id}`,
      { data: { id },
     headers: {
        "Authorization": authorization
      }, },
      
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}