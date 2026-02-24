"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setTokenIsNotThere, setTokenIsThere } from "@/config/redux/reducer/authReducer";

export default function DashBoardLayout({ children }) {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const dispatch = useDispatch();

  // Run once on mount: check localStorage token; if missing, go to login
  useEffect(() => {
    // Only run in the browser; check localStorage token
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      const hasToken = Boolean(localToken);

      if (!hasToken) {
        dispatch(setTokenIsNotThere());
        router.push("/login");
      } else {
        dispatch(setTokenIsThere());
      }
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="order-2 flex flex-col gap-4 lg:order-none lg:w-56">
          <div className="rounded-2xl border border-subtle bg-[color:var(--surface)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Navigate
            </p>
            <div className="mt-4 flex gap-3 overflow-x-auto lg:flex-col">
              <button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold transition hover:border-subtle hover:bg-orange-50"
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
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Scroll
              </button>

              <button
                onClick={() => {
                  router.push("/discover");
                }}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold transition hover:border-subtle hover:bg-orange-50"
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                Discover
              </button>

              <button
                onClick={() => {
                  router.push("/my_connections");
                }}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold transition hover:border-subtle hover:bg-orange-50"
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                My Connections
              </button>
            </div>
          </div>
        </aside>

        <main className="order-1 flex-1 lg:order-none">{children}</main>

        <aside className="order-3 lg:w-64">
          <div className="rounded-2xl border border-subtle bg-[color:var(--surface)] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Top Profiles</p>
              <span className="text-xs text-[color:var(--muted)]">Trending</span>
            </div>
            <div className="mt-4 space-y-3">
              {authState.all_profile_fetched &&
                Array.isArray(authState.all_users) &&
                authState.all_users.map((user) => {
                  if (!user || !user.userId) return null;
                  const key =
                    user._id ||
                    user.userId?._id ||
                    user.userId?.email ||
                    user.userId?.username;
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-subtle px-3 py-2"
                    >
                      <p className="text-sm font-semibold">
                        {user.userId.name}
                      </p>
                      <p className="text-xs text-[color:var(--muted)]">
                        @{user.userId.username}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
