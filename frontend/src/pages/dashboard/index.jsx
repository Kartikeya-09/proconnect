import {
  getAllPosts,
  createPost,
  deletePost,
  incrementLike,
  getAllComments,
  postComment,
} from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import React, { useEffect, useState } from "react";

import { baseURL } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import { resetPostId } from "@/config/redux/reducer/postReducer";
function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (authState.isTokenThere) {
      // Fetch user data or perform any other actions
      dispatch(getAllPosts());
      dispatch(getAboutUser());
    }

    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  useEffect(() => {
    if (postState.postId !== "") {
      console.log('Fetching comments for postId:', postState.postId);
      dispatch(getAllComments({ postId: postState.postId }));
    }
  }, [postState.postId, dispatch]);

  const [postContainer, setPostContainer] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContainer }));
    setPostContainer("");
    setFileContent(undefined);
    dispatch(getAllPosts());
  };

  if (authState.user) {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div className="space-y-6">
            <div className="card-surface relative rounded-2xl p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <img
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                  src={`${baseURL}/${authState.user?.userId?.profilePicture || ""}`}
                  alt="profile"
                />
                <textarea
                  onChange={(e) => setPostContainer(e.target.value)}
                  value={postContainer}
                  placeholder="What's in your mind?"
                  className="min-h-[72px] flex-1 resize-none rounded-2xl border border-subtle bg-white/90 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                ></textarea>
                <label
                  htmlFor="fileUpload"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-subtle bg-white shadow-sm transition hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </label>
                <input
                  onChange={(e) => setFileContent(e.target.files[0])}
                  type="file"
                  hidden
                  id="fileUpload"
                />
              </div>
              {postContainer.length > 0 && (
                <button
                  onClick={handleUpload}
                  className="absolute -bottom-4 right-4 rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
                >
                  Post
                </button>
              )}
            </div>

            <div className="space-y-6">
              {Array.isArray(postState.posts) &&
                postState.posts.map((post) => {
                  const postUser = post?.userId;
                  const postUserId =
                    postUser && typeof postUser === "object"
                      ? postUser._id
                      : postUser;
                  const currentUserId =
                    authState?.user && typeof authState.user === "object"
                      ? authState?.user?.userId?._id
                      : null;
                  const isOwner =
                    postUserId &&
                    currentUserId &&
                    String(postUserId) === String(currentUserId);

                  return (
                    <article
                      key={post?._id}
                      className="rounded-2xl border border-subtle bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={`${baseURL}/${postUser?.profilePicture || ""}`}
                          alt="profile"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {postUser?.name || "Unknown User"}
                              </p>
                              <p className="text-xs text-[color:var(--muted)]">
                                @{postUser?.username || ""}
                              </p>
                            </div>
                            {isOwner && (
                              <button
                                onClick={async () => {
                                  await dispatch(deletePost({ post_id: post._id }));
                                  await dispatch(getAllPosts());
                                }}
                                className="rounded-full border border-red-200 p-2 text-red-500 transition hover:-translate-y-0.5"
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          <p className="mt-3 text-sm leading-relaxed">
                            {post?.body || ""}
                          </p>

                          {post?.media && (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-subtle">
                              <img
                                src={`${baseURL}/${post.media}`}
                                alt=""
                                className="w-full object-cover"
                              />
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                            <button
                              onClick={async () => {
                                await dispatch(incrementLike({ postId: post._id }));
                                dispatch(getAllPosts());
                              }}
                              className="flex items-center gap-2 rounded-full border border-subtle px-4 py-2 text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"
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
                                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                />
                              </svg>
                              {post.likes}
                            </button>
                            <button
                              onClick={async () => {
                                await dispatch(
                                  getAllComments({ postId: post._id })
                                );
                              }}
                              className="flex items-center gap-2 rounded-full border border-subtle px-4 py-2 text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"
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
                                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                />
                              </svg>
                              Comment
                            </button>
                            <button
                              onClick={() => {
                                const text = encodeURIComponent(post.body);
                                const url = encodeURIComponent("learning.in");

                                const twitterUrl = `https://twitter.com//intent/tweet?text=${text}&url=${url}`;
                                window.open(twitterUrl, "_blank");
                              }}
                              className="flex items-center gap-2 rounded-full border border-subtle px-4 py-2 text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"
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
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                />
                              </svg>
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>

          {postState.postId !== "" && (
            <div
              onClick={() => {
                dispatch(resetPostId());
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">Comments</h2>
                  <button
                    onClick={() => dispatch(resetPostId())}
                    className="rounded-full border border-subtle px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
                  >
                    Close
                  </button>
                </div>

                {postState.comments.length === 0 && (
                  <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
                    No comments yet.
                  </p>
                )}

                {postState.comments.length !== 0 && (
                  <div className="mt-6 max-h-[50vh] space-y-4 overflow-y-auto pr-2">
                    {Array.isArray(postState.comments) &&
                      postState.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-subtle bg-slate-50 p-4"
                        >
                          <div className="flex gap-3">
                            <img
                              src={`${baseURL}/${comment.userId?.profilePicture || ""}`}
                              alt="profile"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold">
                                {comment.userId?.name || "Unknown User"}
                              </p>
                              <p className="text-xs text-[color:var(--muted)]">
                                @{comment.userId?.username || ""}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed">
                            {comment.body || ""}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3 border-t border-subtle pt-4">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment"
                    className="flex-1 rounded-full border border-subtle bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300/60"
                  />
                  <button
                    onClick={async () => {
                      await dispatch(
                        postComment({
                          post_id: postState.postId,
                          body: commentText,
                        })
                      );
                      await dispatch(getAllComments({ postId: postState.postId }));
                    }}
                    className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          )}
        </DashBoardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div>Loading...</div>
        </DashBoardLayout>
      </UserLayout>
    );
  }
}

export default Dashboard;
