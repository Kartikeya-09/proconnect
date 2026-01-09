import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

// Async thunk action for user login
// This action sends a POST request to the /user/login endpoint with user credentials
// On success, it returns the response data
// On failure, it rejects with the error response data


export const loginUser =  createAsyncThunk(
    'user/login',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/login',{
                email: user.email,
                 password: user.password
            });
            if(response.data.token  ){
                // Store token in localStorage for backward compatibility
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', response.data.token);
                }
            }else{
                return thunkAPI.rejectWithValue("Token not found");
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk action for user registration
// This action sends a POST request to the /user/register endpoint with user details
// On success, it stores the token in localStorage and returns the token
// On failure, it rejects with the error response data


export const registerUser =  createAsyncThunk(
    'user/register',
    async (user ,  thunkAPI) => {
        try {
            const response = await clientServer.post('/register', {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name
            });
            
        } catch (error) {
            const payload = error.response.data || error?.message || 'Registration failed';
            return thunkAPI.rejectWithValue(payload);
        }
    }
);

export const getAboutUser =  createAsyncThunk(
    'user/getAboutUser',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_user_and_profile');
            return thunkAPI.fulfillWithValue(response.data);    
        } catch (error) {
            const payload = error?.response?.data || error?.message || 'Failed to fetch user';
            return thunkAPI.rejectWithValue(payload);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/get_all_users');
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const  sendConnectionRequest = createAsyncThunk(
    'user/sendConnectionRequest',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/user/send_connection_request', {
                token: user.token,
                connectionId: user.user_id
            });
                thunkAPI.dispatch(getConnectionRequests({token : user.token}));
            return thunkAPI.fulfillWithValue(response.data.requests);
        }catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        } 
    }
);

export const getConnectionRequests = createAsyncThunk(
    'user/getConnectionRequests',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/get_connection_request',{
                params:{
                    token: user.token
                }
            })
            // backend returns { requests: [...] }
            return thunkAPI.fulfillWithValue(response.data.requests);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getMyConnectionsReqests = createAsyncThunk(
    'user/getMyConnectionsReqests',
    async (user, thunkAPI) => { 
        try {
            const response = await clientServer.post('/user/user_connection_request',{
                token: user.token
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }   
    }
);


export const acceptConnectionRequest = createAsyncThunk(
    'user/acceptConnectionRequest',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/user/accept_connection_request', {
                token: user.token,
                requestId: user.connectionId,
                actionType: user.action
            });
            // Refresh both received and sent views so UI reflects new status
            thunkAPI.dispatch(getMyConnectionsReqests({ token: user.token }));
            thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);