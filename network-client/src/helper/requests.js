import axios from "axios";

const baseUrl = 'http://localhost:3000/api';

export const signup = async ({ firstName, lastName, birthDate, email, password }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, {
        firstName, lastName, birthDate, email, password
      });
      return response;
    } catch (error) {
      console.error('Error during signup:', error);
      return { error: error.message };
    }
};

export const auth = async (email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching login:', error);
        return { error: error.message };
    }
};

export const getChats = async (limit, offset) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return { error: 'No token found' };
    }

    try {
        const response = await axios.get(
            `${baseUrl}/chat?limit=${limit}&offset=${offset}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        return { error: error.message };
    }
};

export const getUser = async (userId) => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found');
        return { error: 'No token found' };
    }

    try {
        const response = await axios.get(`${baseUrl}/auth/user/${userId}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
      } catch (error) {
        console.error('Error fetching login:', error);
        return { error: error.message };
      }
}

export const getConnectionRequests = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return { error: 'No token found' };
    }

    try {
        const response = await axios.get(
            `${baseUrl}/auth/connect/`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        return { error: error.message };
    }
}
