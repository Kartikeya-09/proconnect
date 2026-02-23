import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

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
          <div className="space-y-8">
            <div className="relative rounded-3xl border border-subtle bg-white pb-12 shadow-sm">
              <div
                className="h-52 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://t4.ftcdn.net/jpg/06/31/31/59/360_F_631315988_31FMZC4kDYijIJzsxNQivlot4GeHow.jpg)",
                }}
              />
              <label
                htmlFor="profilePictureUpload"
                className="absolute left-6 top-[calc(100%-3.5rem)] z-20 flex h-24 w-24 items-center justify-center rounded-full bg-black/60 text-xs font-semibold text-white opacity-0 transition hover:opacity-100"
              >
                Edit
              </label>
              <input
                hidden
                type="file"
                id="profilePictureUpload"
                onChange={(e) => updateProfilePicture(e.target.files[0])}
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
                  <input
                    className="font-display text-2xl font-semibold outline-none"
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

                  <p className="text-sm text-[color:var(--muted)]">
                    @{userProfile.userId.username}
                  </p>
                </div>

                <textarea
                  id="bio"
                  value={userProfile.bio}
                  onChange={(e) => {
                    setUserProfile({ ...userProfile, bio: e.target.value });
                  }}
                  rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                  className="w-full rounded-2xl border border-subtle bg-white/90 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/50"
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                    Work
                  </p>
                  <h4 className="font-display text-2xl">Work History</h4>
                </div>
                <button
                  className="rounded-full border border-dashed border-subtle bg-white px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Work
                </button>
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

            <button
              className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20"
              onClick={updateProfileData}
            >
              Update Profile
            </button>
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                    Add Work
                  </p>
                  <h4 className="font-display text-2xl">New experience</h4>
                </div>
                <input
                  onChange={handleWorkinputChnage}
                  name="company"
                  className="w-full rounded-xl border border-subtle bg-white/90 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                  type="text"
                  placeholder="Enter Company Name"
                />
                <input
                  onChange={handleWorkinputChnage}
                  name="position"
                  className="w-full rounded-xl border border-subtle bg-white/90 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                  type="text"
                  placeholder="Enter Position"
                />
                <input
                  onChange={handleWorkinputChnage}
                  name="years"
                  className="w-full rounded-xl border border-subtle bg-white/90 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                  type="number"
                  placeholder="Years"
                />

                <button
                  onClick={() => {
                    setUserProfile({
                      ...userProfile,
                      pastWork: [...userProfile.pastWork, inputDetail],
                    });
                    setIsModalOpen(false);
                  }}
                  className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20"
                >
                  Add Work
                </button>
              </div>
          
            </div>
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
};

export default ProfilePage;
