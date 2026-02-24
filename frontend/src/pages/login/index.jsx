import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.isLoggedIn) {
      router.push("/dashboard");
    }
  }, [authState.isLoggedIn]);

  // On mount, if token exists in localStorage, redirect away from login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        router.replace("/dashboard");
      }
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoggedIn]);

  const handleRegister = () => {
    dispatch(
      registerUser({
        username,
        password,
        email,
        name,
      })
    );
  };

  const handleLogin = () => {
    // Dispatch login action
    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };
  return (
    <UserLayout>
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl items-center px-4 py-12">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-subtle bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="flex flex-col gap-6 px-8 py-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted)]">
                Welcome
              </p>
              <p className="font-display text-3xl">
                {isLoggedIn ? "Welcome back!" : "Please log in."}
              </p>
              <p
                className={`mt-2 text-sm font-semibold ${
                  authState.isError ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {authState.message.message}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {!isLoggedIn && (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-subtle bg-white/80 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/60"
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-subtle bg-white/80 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/60"
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-white/80 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/60"
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-white/80 px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300/60"
                type="password"
                placeholder="Password"
              />

              <button
                onClick={() => {
                  if (isLoggedIn) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className="rounded-full bg-[linear-gradient(120deg,#0ea5e9,#f97316)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
              >
                {isLoggedIn ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 bg-[linear-gradient(135deg,#0f172a,#0ea5e9)] px-8 py-10 text-white">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                Why join
              </p>
              <p className="font-display text-3xl">Build a smarter circle.</p>
              <p className="text-sm text-white/70">
                Share your story, find collaborators, and keep your work visible
                to the right people.
              </p>
              <div className="space-y-2 text-sm">
                {[
                  "Curated communities",
                  "Actionable insights",
                  "Real-time connections",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/20 px-4 py-2"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm">
                {isLoggedIn
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                onClick={() => {
                  setIsLoggedIn(!isLoggedIn);
                }}
                className="w-full rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isLoggedIn ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
