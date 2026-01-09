import bcrypt from 'bcrypt';
import  crypto from 'crypto';
import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';
import connectionRequst from '../models/connection.model.js';
import PDFDoucument from 'pdfkit';
import fs from 'fs';
import path from 'path';


// Utility function to convert user data to PDF..
const convertUserDataToPdf = async (userData) => {
    const doc = new PDFDoucument();

    const outputPath = crypto.randomBytes(32).toString('hex') + '.pdf';
    const stream = fs.createWriteStream("uploads/" + outputPath);
    
    doc.pipe(stream);
    
    // Add profile picture if it exists
    if (userData.userId && userData.userId.profilePicture) {
        try {
            doc.image(`uploads/${userData.userId.profilePicture}`, {align: "center", width: 100 });
        } catch (error) {
            console.log('Profile picture not found, skipping image');
        }
    }

    doc.fontSize(25).text(userData.userId.name, {align: "center"});
    doc.fontSize(20).text(`Username: ${userData.userId.username}`);
    doc.fontSize(20).text(`Email: ${userData.userId.email}`);
    doc.fontSize(15).text(`Bio: ${userData.bio || 'No bio available'}`);
    doc.fontSize(15).text(`currentPosition: ${userData.currentPosition || 'N/A'}`);

    doc.fontSize(14).text("Past Work: ");
    if (userData.pastWork && userData.pastWork.length > 0) {
        userData.pastWork.forEach((work, index) => {
            doc.fontSize(14).text("Education: " + (work.education || 'N/A')); 
            doc.fontSize(14).text("Position: " + (work.currentPost || 'N/A')); 
            doc.fontSize(14).text("Duration: " + (work.years || 'N/A'));
        });
    } else {
        doc.fontSize(14).text("No past work experience recorded");
    }
    
    doc.end();
    return outputPath;
}


export const register = async (req, res) => {
  try {
    const {name , username, email, password } = req.body;

    if(!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }   

    const user = await User.findOne({ email });

    if(user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
        // Hash password before saving to database

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(
        { name, 
            username, 
            email, 
            password: hashedPassword 
        });
    await Profile.create({ userId: newUser._id });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error?.message || error });
  }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate and persist a session token
        const token = crypto.randomBytes(24).toString('hex');
        await User.updateOne({ _id: user._id }, { token });

        // Set a readable cookie so frontend can check it and redirect
        // Note: httpOnly is false so document.cookie can access it (tradeoff for simplicity in this flow)
        res.cookie('token', token, {
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Also return token in response so frontend can store in localStorage
        return res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error?.message || error });
    }
};

export const uploadprofilepicture = async (req, res) => {
    try {
    const { token } = req.body; // Using token-based lookup per current app

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the token and find the user
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Multer places the uploaded file on req.file when using upload.single('profile_picture')
    if (!req.file) {
      return res.status(400).json({ message: 'profile_picture file is required' });
    }

    // Save relative path to the file so it can be served statically
    const relativePath = `uploads/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    return res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: relativePath });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile picture', error: error?.message || error });
    }
};

export const updateUserProfile = async (req, res) => {
    try {

        const { token , ...newUserData} = req.body; // Using token-based lookup per current app  

        const user = await User.findOne({ token : token });



        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const {username, email} = newUserData;
        // Check for existing username or email
        const existingUser = await User.findOne({ $or: [ { username }, { email } ], _id: { $ne: user._id } });

        if (existingUser) {
          if(existingUser || String(existingUser._id) !== String(user._id)){
              return res.status(409).json({ message: 'Username or email already in use' });
          }
        }

        // Update user profile
        Object.assign(user, newUserData);
        await user.save();

        return res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error?.message || error });
    }
};

export const getUserAndProfile = async (req, res) => {
    try {
        // Prefer token from cookie (current session), fallback to query param
        const tokenFromCookie = req.cookies?.token;
        const tokenFromQuery = req.query?.token;
        const token = tokenFromCookie || tokenFromQuery;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
    

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate('userId', 'name username email profilePicture'); // Populate user details

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        return res.status(200).json({ message: 'User found', user, userProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user and profile', error: error?.message || error });
    }
};

export const updateProfileData = async (req, res) => {
    try {
        console.log('updateProfileData called with body:', req.body);
        const { token , ...newProfileData} = req.body; // Using token-based lookup per current app 
      //  we find user by token, then profile by userId
        console.log('Token received:', token);
        console.log('Profile data to update:', newProfileData);
        
        let userProfile = await User.findOne({ token : token });
        console.log('User found:', userProfile ? userProfile.username : 'NOT FOUND');

        if (!userProfile) {
          return res.status(404).json({ message: 'Profile not found' });
        }
        // Find the profile associated with the user
        const profile_to_update = await Profile.findOne({ userId: userProfile._id });
        console.log('Profile to update found:', profile_to_update ? 'YES' : 'NO');

        if (!profile_to_update) {
            return res.status(404).json({ message: 'Profile to update not found' });
        }

        // Update profile data
        Object.assign(profile_to_update, newProfileData);
    
        await profile_to_update.save();
        console.log('Profile updated successfully');

        return res.status(200).json({ message: 'Profile updated successfully', profile: profile_to_update });
    } catch (error) {
        console.error('Error in updateProfileData:', error);
        res.status(500).json({ message: 'Error updating profile data', error: error?.message || error });
    }
};

export const getAllusers = async (req, res) => {
    try {
        const users = await Profile.find().populate('userId', 'name username email profilePicture');

        return res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error?.message || error });
    }
};

export const downloadProfile = async (req, res) => {
    try {
        const user_id = req.query.id;
        
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const userProfile = await Profile.findOne({ userId: user_id })
            .populate('userId', 'name username email profilePicture'); // Populate user details
            
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        
        const outputPath = await convertUserDataToPdf(userProfile);
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${outputPath}`;
        // Return full URL so the client can open/download directly
        return res.json({ message: 'PDF generated successfully', filePath: outputPath, fileUrl });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};

export const sendConnectionRequest = async (req, res) => {
    try {
        const { token, connectionId } = req.body;
        
        const user =  await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const connectionUser = await User.findById(connectionId);
        if (!connectionUser) {
            return res.status(404).json({ message: 'Connection user not found' });
        }
        // Prevent sending request to oneself
        if (user._id.toString() === connectionUser._id.toString()) {
            return res.status(400).json({ message: 'Cannot send connection request to yourself' });
        }
        // const existingRequest = await connectionRequst.findOne({
        //     userId: user._id,
        //     connectionId: connectionUser._id,
        // })
        

        // if(existingRequest){
        //     return res.status(400).json({ message: 'Connection request already sent' });
        // }
    
            const newRequest = new connectionRequst({
                userId: user._id,
                connectionId: connectionUser._id,
            });
           
            await newRequest.save();
           

            return res.status(200).json({ message: 'Connection request sent successfully' });

    }catch(error){
        res.status(500).json({ message: 'Error sending connection request', error: error?.message || error });
    }
}

export const getMyConnectionRequests = async (req, res) => {
    try {
        const token = req.body.token || req.query.token;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        
        const user =  await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        const requests = await connectionRequst.find({ userId: user._id })
            .populate('connectionId', 'name username email profilePicture')
            .exec();

        return res.status(200).json({ message: 'Connection requests fetched successfully', requests });
    }catch(error){
        res.status(500).json({ message: 'Error fetching connection requests', error: error?.message || error });
    }
}

export const getMyConnections = async (req, res) => {
    try {
        const token = req.query.token || req.body.token;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        
        const user =  await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        const connections = await connectionRequst.find({ connectionId: user._id})
            .populate('userId', 'name username email profilePicture')
            .exec();

        return res.status(200).json({ message: 'Connections fetched successfully', connections });
    }catch(error){
        res.status(500).json({ message: 'Error fetching connections', error: error?.message || error });
    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { token, requestId, actionType } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const request = await connectionRequst.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (actionType === 'accept') {
            request.staus_accepted = true;
        } else if (actionType === 'reject') {
            request.staus_accepted = false;
        } else {
            return res.status(400).json({ message: 'Invalid action type' });
        }

        await request.save();
        return res.status(200).json({ message: `Connection request ${actionType}ed successfully`, request });
    } catch (error) {
        res.status(500).json({ message: 'Error processing connection request', error: error?.message || error });
    }
};


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({    
            username: username
        }); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const profile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name username email profilePicture'); // Populate user details
        if (!profile) {
            return res.status(404).json({ message: 'User profile not found' }); 
        }
        return res.status(200).json({ message: 'User found', profile });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user and profile', error: error?.message || error });
    }
};  





