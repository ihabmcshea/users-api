import axios from 'axios';
import { NextResponse } from 'next/server';
axios.interceptors.request.use((request) => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

export async function PUT(request: Request) {
  try {
    // Extract data from the request
    const body = await request.json();
    const authorization = request.headers?.get('Authorization');

    // Send request to the NestJS backend
    const response = await axios.put(
      `http://backend:4000/api/v1/users/profile`,
      body,
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
  try {
    const { data } = await axios.get(`http://backend:4000/api/v1/users/profile`, {
      headers: {
        "Authorization": authorization
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
