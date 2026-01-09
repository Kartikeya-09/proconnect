import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
function NavbarComponent() {

    const router =  useRouter();

    const authState = useSelector((state) => state.auth);
  return (

    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 onClick={()=>{
            router.push("/")
        }}>
            Pro Connect
        </h1>

          {authState.profileFetch && (
        <div className={styles.navRight}>
            {/* <p>Hey, {authState?.user?.userId?.name || ""}</p> */}
            <p className={styles.profileLink} onClick={()=> router.push('/profile')}>Profile</p>
            <p className={styles.profileLink} onClick={()=>{
              // Clear the token cookie and localStorage
              if (typeof document !== 'undefined') {
                document.cookie = 'token=; Max-Age=0; path=/';
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
              }
              if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
              }
              router.push("/login");
            }}>LogOut</p>
        </div>
          )}

        {!authState.profileFetch && (
        <div className={styles.navRight}>
            <div onClick = {()=>{
                router.push("/login")
            }} className={styles.buttonJoin}>
                <p>Be a part</p>
            </div>
        </div>
        )}

      </nav>
    </div>
  )
}

export default NavbarComponent