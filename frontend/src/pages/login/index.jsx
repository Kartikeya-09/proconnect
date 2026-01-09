import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
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

  // On mount, if token cookie exists already, redirect away from login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasToken = document.cookie
        .split("; ")
        .some((row) => row.startsWith("token="));
      if (hasToken) {
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
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardLeft_heading}>
              {isLoggedIn ? "Welcome back!" : "Please log in."}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>

            <div className={styles.inputContainer}>
              {!isLoggedIn && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="Password"
                placeholder="Password"
              />

              <div
                onClick={() => {
                  if (isLoggedIn) {
                    // Handle Login
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{isLoggedIn ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}>
            {isLoggedIn ? (
              <p>Don't have an account</p>
            ) : (
              <p>Already have an account</p>
            )}
            <div
              onClick={() => {
                setIsLoggedIn(!isLoggedIn);
              }}
              style={{
                border: "2px solid white",
                textAlign: "center",
                width: "100%",
                color: "black",
              }}
              className={styles.buttonWithOutline}
            >
              <p>{isLoggedIn ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
