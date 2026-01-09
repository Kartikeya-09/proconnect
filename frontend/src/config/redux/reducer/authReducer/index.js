import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllUsers, getConnectionRequests, getMyConnectionsReqests } from "../../action/authAction";
import { all } from "axios";

// Initial state for the auth slice

const initialState = {
    user: undefined,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isLoggedIn: false,
    isTokenThere: false,
    message: "",
    profileFetch: false,
    connections: [],
    connectionRequests: [],
    all_users: [],
    all_profile_fetched: false
};

// Create the auth slice including reducers and extra reducers for async actions
// Handles login and registration actions
// Updates state based on action status (pending, fulfilled, rejected)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,  
        handleLoginUser :(state) => {
            state.message = "hello";
        },
        emptyMessage: (state) => {
            state.message = "";
        },
        setTokenIsThere:(state) =>  {
            state.isTokenThere = true;
        },
        setTokenIsNotThere:(state) =>  {
            state.isTokenThere = false;
        },

    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Knocking the door...";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.isError = false;
                state.isSuccess = true;
                state.user = action.payload; // token is stored here 
                state.message = "Login is successful!";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Login failed";
            })
            // get about user (profile + user)
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                // Store the profile object (has userId populated)
                state.user = action.payload.userProfile || null;
                state.profileFetch = true;
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.profileFetch = false;
                state.message = action.payload || "Failed to fetch user";
            })
            // register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering the user...";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = {
                    message:  "Registration is successful!",
                    description: "Please login to continue."
                };
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Registration failed";
            })
            .addCase(getAllUsers.fulfilled,(state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.all_profile_fetched = true;
                state.all_users = action.payload.users || [];
            })
            .addCase(getConnectionRequests.fulfilled, (state, action) => {
                state.connections = action.payload
            })
            .addCase(getConnectionRequests.rejected, (state, action) => {
                state.message = action.payload ;
            })
            .addCase(getMyConnectionsReqests.fulfilled, (state, action) => {
                // Ensure we only store the array of connections returned by the API
                state.connectionRequests = action.payload?.connections || [];
            })
            .addCase(getMyConnectionsReqests.rejected, (state, action) => {
                state.message = action.payload ;
            });

    }
});

export const { reset ,  emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;
export default authSlice.reducer;