import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

function NavbarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="sticky top-0 z-30 w-full border-b border-subtle bg-[color:var(--surface)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <button
          className="font-display text-2xl tracking-tight"
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </button>

        {authState.profileFetch && (
          <div className="flex items-center gap-3 text-sm font-semibold">
            <button
              className="rounded-full border border-subtle px-4 py-2 text-[color:var(--muted)] transition hover:-translate-y-0.5 hover:text-[color:var(--ink)]"
              onClick={() => router.push("/profile")}
            >
              Profile
            </button>
            <button
              className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-4 py-2 text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
              onClick={() => {
                // Clear localStorage token
                if (typeof window !== "undefined") {
                  localStorage.removeItem("token");
                }
                dispatch(reset());
                router.push("/login");
              }}
            >
              Log out
            </button>
          </div>
        )}

        {!authState.profileFetch && (
          <div className="flex items-center gap-3">
            <button
              className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
              onClick={() => {
                router.push("/login");
              }}
            >
              Be a part
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavbarComponent;