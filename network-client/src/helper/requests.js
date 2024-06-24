import axios from "axios";

export const getChats = async (limit, offset) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No token found');
        return { error: 'No token found' };
    }

    try {
        const response = await axios.get(
            `http://localhost:3000/api/chat?limit=${limit}&offset=${offset}`, 
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