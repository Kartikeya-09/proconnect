import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import {
  acceptConnectionRequest,
  getMyConnectionsReqests,
} from "@/config/redux/action/authAction";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import { useRouter } from "next/router";
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
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                Requests
              </p>
              <h4 className="font-display text-2xl">My Connection Requests</h4>
            </div>
            <span className="rounded-full border border-subtle bg-white px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
              {authState.connectionRequests.filter(
                (connection) => connection.staus_accepted === null
              ).length || 0}
            </span>
          </div>

          {authState.connectionRequests.length === 0 && (
            <p className="text-sm text-[color:var(--muted)]">
              No connection requests at the moment.
            </p>
          )}

          {Array.isArray(authState.connectionRequests) &&
            authState.connectionRequests
              .filter((connection) => connection.staus_accepted === null)
              .map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-subtle bg-white p-4 text-left shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={resolveMediaUrl(user.userId?.profilePicture)}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-base font-semibold">
                        {user.userId?.name}
                      </h3>
                      <p className="text-sm text-[color:var(--muted)]">
                        @{user.userId?.username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        acceptConnectionRequest({
                          connectionId: user._id,
                          token: localStorage.getItem("token"),
                          action: "accept",
                        })
                      );
                    }}
                    className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/20"
                  >
                    Accept
                  </button>
                </button>
              ))}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
              Network
            </p>
            <h4 className="font-display text-2xl">My Network</h4>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {authState.connectionRequests
              .filter((connection) => connection.staus_accepted !== null)
              .map((user) => {
                return (
                  <button
                    key={user._id}
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    className="flex items-center gap-4 rounded-2xl border border-subtle bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5"
                  >
                    <img
                      src={resolveMediaUrl(user.userId?.profilePicture)}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-base font-semibold">
                        {user.userId?.name}
                      </h3>
                      <p className="text-sm text-[color:var(--muted)]">
                        @{user.userId?.username}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
      </DashBoardLayout>
        
      
    </UserLayout>
  )
}
