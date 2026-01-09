import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export  const getAllPosts = createAsyncThunk(
    'posts/getAllPosts',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/posts');
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const createPost = createAsyncThunk(
    
    'post/createPost',
    async (userData, thunkAPI) => {
        const {file,body} = userData;
        try {
            const formData = new FormData();

            // Read token from cookie instead of localStorage
            const getCookie = (name) => {
                if (typeof document === 'undefined') return null;
                const match = document.cookie
                  .split('; ')
                  .find((row) => row.startsWith(name + '='));
                return match ? decodeURIComponent(match.split('=')[1]) : null;
            };
            const token = getCookie('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Not authenticated');
            }

            formData.append('token', token);
            formData.append('body', body);
            formData.append('media', file);
            const response = await clientServer.post('/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Post uploaded");
            }else{
                return thunkAPI.rejectWithValue("Post not uploaded");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deletePost = createAsyncThunk(
    'post/deletePost',
    async (postId, thunkAPI) => {
        try {
            // Read token from cookie instead of localStorage
             const getCookie = (name) => {
                if (typeof document === 'undefined') return null;
                const match = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith(name + '='));
                return match ? decodeURIComponent(match.split('=')[1]) : null;
            };
            const token = getCookie('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Not authenticated');
            }
            const response = await clientServer.delete(`/delete_post`, {
                data: {
                    token: token,
                    postId: postId.post_id
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const incrementLike = createAsyncThunk(
    'post/incrementLike',
    async (post, thunkAPI) => {   
        try {
        // backend route is `/like_post`
        const response = await clientServer.post('/like_post', {
            postId: post.postId
        });
        return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllComments = createAsyncThunk(
    'post/getAllComments',
    async (postData, thunkAPI) => {
        try {

            // POST the postId in the body; backend accepts body or query now
            const response = await clientServer.post('/get_comments', { postId: postData.postId });
            const comments = response.data.comments ;
            return thunkAPI.fulfillWithValue({
                comments,
                postId: postData.postId,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || error.message || 'Error fetching comments');
        }
    }
);

export const postComment = createAsyncThunk(
    'post/postComment',
    async (commentData, thunkAPI) => {
        try {
            const getCookie = (name) => {
                if (typeof document === 'undefined') return null;
                const match = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith(name + '='));
                return match ? decodeURIComponent(match.split('=')[1]) : null;
            };
             const token = getCookie('token');

            const { post_id, body } = commentData;  
            const response = await clientServer.post('/comment', {
                token: token,
                postId: commentData.post_id,
                commentBody: commentData.body
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || error.message || 'Error posting comment');
        }
    }
);