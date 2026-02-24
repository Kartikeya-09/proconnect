import React from "react";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import UserLayout from "@/layout/UserLayout";
import { useEffect } from "react";
import DashBoardLayout from "@/layout/DashBoardLayout";
import { useDispatch } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                Discover
              </p>
              <h1 className="font-display text-3xl">People to know</h1>
            </div>
            <div className="rounded-full border border-subtle bg-white px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
              {authState.all_users?.length || 0} profiles
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {authState.all_users &&
              authState.all_users.map((user, index) => {
                // Handle nested userId structure from API response
                const userData = user?.userId || user;
                const profilePicture = userData?.profilePicture;
                return (
                  <button
                    onClick={() =>
                      router.push(`/view_profile/${userData.username}`)
                    }
                    key={index}
                    className="flex items-center gap-4 rounded-2xl border border-subtle bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5"
                  >
                    <img
                      src={resolveMediaUrl(profilePicture)}
                      alt="profile"
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold">
                        {userData?.name}
                      </p>
                      <p className="text-sm text-[color:var(--muted)]">
                        @{userData?.username || ""}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </DashBoardLayout>

    </UserLayout>
  )
}
