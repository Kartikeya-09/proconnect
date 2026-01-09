import { clientServer } from "@/config";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import React, { useSearchParams } from "react";
import { baseURL } from "@/config";
import styles from "./index.module.css";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  sendConnectionRequest,
  getConnectionRequests,
  getMyConnectionsReqests,
} from "@/config/redux/action/authAction";

const viewProfilePage = ({ userProfile }) => {
  const searchParamers = useSearchParams;
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    await dispatch(getAllPosts()); // fetch all posts so we can filter for this user
    const token = localStorage.getItem("token");
    await dispatch(getConnectionRequests({ token })); // sent requests
    await dispatch(getMyConnectionsReqests({ token })); // received requests
  };

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(() => {
    // Filter posts for the specific user
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    // Consider both directions: requests we sent (connections) and requests we received (connectionRequests)
    const allConnections = [
      ...(authState.connections || []),
      ...(authState.connectionRequests || []),
    ];

    const match = allConnections.find(
      (conn) =>
        conn?.connectionId?._id === userProfile.userId._id ||
        conn?.userId?._id === userProfile.userId._id
    );

    if (match) {
      setIsCurrentUserInConnection(true);
      // staus_accepted: null => pending, true => connected
      setIsConnectionNull(match.staus_accepted !== true);
    } else {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
    }
  }, [authState.connections, authState.connectionRequests, userProfile.userId._id]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
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
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.7rem",
                    alignItems: "center",
                    margin: "0.8rem 0",
                  }}
                >
                  {isCurrrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        const connectionId = userProfile?.userId?._id;
                        if (!token || !connectionId) return; // guard against missing data
                        dispatch(
                          sendConnectionRequest({
                            token,
                            user_id: connectionId,
                          })
                        );
                      }}
                      disabled={!userProfile?.userId?._id}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}

                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_profile?id=${userProfile.userId._id}`
                      );
                      // fileUrl is already absolute (http://localhost:8080/uploads/...) so open directly
                      window.open(response.data.fileUrl, "_blank");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
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
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
};

// Fetch user profile based on username from server side renderring
//Why we do this ? because it can be beneficial for SEO and initial page load performance.

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.params.username,
      },
    }
  );

  const response = await request.data;
  console.log(response);
  return { props: { userProfile: request.data.profile } };
}
export default viewProfilePage;
