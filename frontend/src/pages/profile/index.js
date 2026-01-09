import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts, getUserPost } from "@/config/redux/action/postAction";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import styles from "./index.module.css";
import { baseURL, clientServer } from "@/config";

const ProfilePage = () => {
  const authState = useSelector((state) => state.auth);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const postReducer = useSelector((state) => state.postReducer);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const[inputDetail, setInputDetail] = useState({
    company: "",
    position: "",
    years: ""
  });
  
  const handleWorkinputChnage = (e) => {
    const { name, value } = e.target;
    setInputDetail({
      ...inputDetail,
      [name]: value,
    });
  }


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    // Field name must match multer field name on the backend
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async (name) => {
    const request = await clientServer.post("/update_profile", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  return (
    <UserLayout>
      <DashBoardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop__overlay}
              >
                <p>Edit</p>
              </label>
              <input
                hidden
                type="file"
                id="profilePictureUpload"
                onChange={(e) => updateProfilePicture(e.target.files[0])}
              />
              <img
                src={`${baseURL}/${userProfile.userId.profilePicture}`}
                alt="backdrop"
                className={styles.backDropImage}
              />
            </div>
            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "fit-content",
                      gap: "1rem",
                    }}
                  >
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />

                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div style={{ border: "none" }}>
                    <textarea
                      id="bio"
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={
                        Math.max(3, Math.ceil(userProfile.bio.length / 80)) // Adjust rows based on content length
                      }
                      style={{ width: "100%" }}
                    ></textarea>
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card__ProfileContainer}>
                            {post.media !== "" ? (
                              <img
                                src={`${baseURL}/${post.media}`}
                                alt="post media"
                                className={styles.postMedia}
                              />
                            ) : (
                              <div
                                style={{ width: "3.4rem", height: "3.4rem" }}
                              ></div>
                            )}
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="workHistory">
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}

                <button className={styles.addWorkButton} onClick={() => {
                  setIsModalOpen(true);
                }}>
                  Add Work
                </button>
              </div>
            </div>
            {userProfile != authState.user && (
              <div
                className={styles.updateProfileButton}
                onClick={updateProfileData}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
               <input
                    onChange={handleWorkinputChnage}
                    name="company"
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter Company Name"
                  />
                   <input
                    onChange={handleWorkinputChnage}
                    name="position"
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter Position"
                  />
                   <input
                    onChange={handleWorkinputChnage}
                    name="years"
                    className={styles.inputField}
                    type="number"
                    placeholder="Years"
                  />

                  <div onClick={()=>{
                    setUserProfile({...userProfile, pastWork:[...userProfile.pastWork , inputDetail]});
                    setIsModalOpen(false);
                  }}
                   className={styles.updateProfileButton}>Add Work</div>
          
            </div>
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
};

export default ProfilePage;
