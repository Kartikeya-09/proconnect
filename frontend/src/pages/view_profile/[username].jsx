import { clientServer } from "@/config";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import React from "react";
import { baseURL } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  sendConnectionRequest,
  getConnectionRequests,
  getMyConnectionsReqests,
} from "@/config/redux/action/authAction";

const viewProfilePage = ({ userProfile }) => {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const isSelfProfile =
    authState?.user?.userId?._id &&
    userProfile?.userId?._id &&
    String(authState.user.userId._id) === String(userProfile.userId._id);

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
        <div className="space-y-8">
          <div className="relative rounded-3xl border border-subtle bg-white pb-12 shadow-sm">
            <div
              className="h-52 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://t4.ftcdn.net/jpg/06/31/31/59/360_F_631315988_31FMZC4kDYijIJzsxNQivlot4GeHow.jpg)",
              }}
            />
            <img
              src={`${baseURL}/${userProfile.userId.profilePicture}`}
              alt="profile"
              className="absolute left-6 top-[calc(100%-3.5rem)] z-10 h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-semibold">
                  {userProfile.userId.name}
                </h2>
                <p className="text-sm text-[color:var(--muted)]">
                  @{userProfile.userId.username}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {isSelfProfile ? (
                  <button
                    className="rounded-full border border-subtle bg-white px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
                    disabled
                  >
                    This is you
                  </button>
                ) : isCurrrentUserInConnection ? (
                  <button className="rounded-full border border-subtle bg-white px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
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
                    className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/20"
                  >
                    Connect
                  </button>
                )}

                <button
                  onClick={async () => {
                    const response = await clientServer.get(
                      `/user/download_profile?id=${userProfile.userId._id}`
                    );
                    // fileUrl is already absolute (http://localhost:8080/uploads/...) so open directly
                    window.open(response.data.fileUrl, "_blank");
                  }}
                  className="flex items-center gap-2 rounded-full border border-subtle px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download profile
                </button>
              </div>

              <textarea
                id="bio"
                value={userProfile.bio}
                readOnly
                rows={Math.max(3, Math.ceil((userProfile.bio || "").length / 80))}
                className="w-full rounded-2xl border border-subtle bg-white/90 px-4 py-3 text-sm text-[color:var(--muted)] shadow-inner focus:outline-none"
              ></textarea>
            </div>

            <div className="w-full lg:w-72">
              <p className="text-sm font-semibold">Recent Activity</p>
              <div className="mt-3 space-y-3">
                {userPosts.map((post) => {
                  return (
                    <div
                      key={post._id}
                      className="rounded-2xl border border-subtle bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        {post.media !== "" ? (
                          <img
                            src={`${baseURL}/${post.media}`}
                            alt="post media"
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-slate-100" />
                        )}
                        <p className="text-sm text-[color:var(--muted)]">
                          {post.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                Work
              </p>
              <h4 className="font-display text-2xl">Work History</h4>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-subtle bg-white p-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold">
                      {work.company} - {work.position}
                    </p>
                    <p className="text-xs text-[color:var(--muted)]">
                      {work.years}
                    </p>
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
  return { props: { userProfile: request.data.profile } };
}
export default viewProfilePage;
