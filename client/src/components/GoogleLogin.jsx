import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { Showtoast } from "@/helpers/Showtoast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";

export default function GoogleLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin = async () => { 
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user
      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      }
      const response = await fetch(`http://localhost:3000/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();

      if (!response.ok) {
        Showtoast("error", data.message);
        return;
      }
      dispatch(setUser(data.user))
      navigate("/");
      Showtoast("success", data.message);
    } catch (error) {
      Showtoast("error", error.message);
    }
  };
  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      <FcGoogle />
      Countinue with google
    </Button>
  );
}
