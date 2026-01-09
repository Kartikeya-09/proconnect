import React, { use } from 'react'
import { baseURL } from "@/config";
import UserLayout from '@/layout/UserLayout'
import { useEffect } from 'react'
import DashBoardLayout from '@/layout/DashBoardLayout'
import { useDispatch } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
import { useSelector } from 'react-redux';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
export default function DiscoverPage() {

  // Redux state
  const authState = useSelector((state) => state.auth);

  const dispatch =  useDispatch();

    useEffect(() => {
        // Fetch all users when the component mounts
        if(!authState.all_profiles_fetched){
          dispatch(getAllUsers());
        }
    }, []);

    const router = useRouter();    

  return (
     <UserLayout>

      <DashBoardLayout>
        <div>
          <h1>Discover</h1>
          <div className={styles.allUserProfile}>
            { authState.all_users && authState.all_users.map((user,index)=>{
              // Handle nested userId structure from API response
              const userData = user?.userId || user;
              const profilePicture = userData?.profilePicture ;
              return (
              <div onClick={() => router.push(`/view_profile/${userData.username}`)}
               key={index}  className={styles.userCard}>
                <img src={`${baseURL}/${profilePicture}`} alt="profile" className={styles.userCard_image} />
                <div>
                <p style={{fontWeight:"bold" , fontSize: "1.2rem"}}>{userData?.name }</p>
                <p >@{userData?.username || ""}</p>
                </div>
              </div>
            )}) }
          </div>
        </div>
      </DashBoardLayout>

    </UserLayout>
  )
}
