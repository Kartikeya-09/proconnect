import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLayout from '@/layout/UserLayout'
import DashBoardLayout from '@/layout/DashBoardLayout'
import { acceptConnectionRequest, getMyConnectionsReqests } from '@/config/redux/action/authAction';
import { baseURL } from '@/config';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getMyConnectionsReqests({ token: localStorage.getItem("token") }));
  }, []);



  useEffect(()=>{
    if(authState.connectionRequests.length != 0){
      console.log("Connections Requests: ", authState.connectionRequests);
    }
  }, [authState.connectionRequests])
  return (
     <UserLayout>

      <DashBoardLayout>
      <div style={{display:"flex" , flexDirection:"column", gap:"1.7rem"}}>
        <h4>My Connection Requests</h4>

          {authState.connectionRequests.length === 0 && (
            <p>No connection requests at the moment.</p>
          )}

          {Array.isArray(authState.connectionRequests) && authState.connectionRequests.filter((connection)=> connection.staus_accepted === null).map((user) => (
            <div key={user._id} onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }}  className={styles.userCard} >
              <div style={{display:"flex" , alignItems:"center"  ,gap:"1.2rem" , justifyContent:"space-between"}}>
                <div className={styles.profilePicture}>
                  <img src={`${baseURL}/${user.userId?.profilePicture }`} alt="" />
                </div>
                <div className={styles.userInfo}>
                    <h3>{user.userId?.name }</h3>
                    <p>@{user.userId?.username }</p>
                </div>
                <button onClick={(e)=>{
                  e.stopPropagation();
                  dispatch(acceptConnectionRequest({
                    connectionId: user._id,
                    token: localStorage.getItem("token"),
                    action: "accept"
                  }))
                }} className={styles.connectedButton}>Accept</button>
              </div>
            </div>
          ))}

        <h4>My Network</h4>

          {authState.connectionRequests.filter((connection)=> connection.staus_accepted !== null).map((user,index)=>{
            return (
             <div key={user._id} onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }}  className={styles.userCard} >
              <div style={{display:"flex" , alignItems:"center"  ,gap:"1.2rem" , justifyContent:"space-between"}}>
                <div className={styles.profilePicture}>
                  <img src={`${baseURL}/${user.userId?.profilePicture }`} alt="" />
                </div>
                <div className={styles.userInfo}>
                    <h3>{user.userId?.name }</h3>
                    <p>@{user.userId?.username }</p>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </DashBoardLayout>
        
      
    </UserLayout>
  )
}
