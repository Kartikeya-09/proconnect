import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";


export default function Home() {

    const router = useRouter();

  return (
    <UserLayout>
    <div className={styles.container}>

      <div className={styles.mainContainer}>

        
        <div className={styles.mainContainer__left}>

      <p>Connect with friends and the world around you on LinkedIn</p>
      
      <p>Join groups, share updates, and build your professional network.</p>

        <div onClick = {()=>{
                router.push("/login")
            }} className={styles.buttonJoin}>
                <p>Join Now</p>
            </div>

        </div>

        <div className={styles.mainContainer__right}>
          <img src="/images/image.png" alt="Description of image" />
        </div>
      </div>
    </div>

    </UserLayout>
  );
}
