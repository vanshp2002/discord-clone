"use client";

import './login.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const session = useSession();
  const router = useRouter();

  useEffect(()=>{
    if(session?.status === "authenticated"){
      router.replace("channels");
    }
  }, [session, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(email, password);
    if (email === "" || password === "") {
      setError("Don't keep any detail empty.")
      return;
    }
    e.preventDefault();

    try{
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

    if (res && res.error){
      setError("Invalid Credentials");
      return;
    }

    router.replace("channels");
    }
    catch(error){
      console.log(error);
    }
  
  }

  return (<>

    <div className="style-0">

      <div className="style-1">
        <form onSubmit={handleSubmit} data-theme="dark" className="style-2">
          <div className="style-3"></div>
          <div className="style-4">
            <h1 className="style-5" data-text-variant="heading-xl/semibold">Welcome Back!</h1>
            <div className="style-6">

              <div className="style-7"><label className="style-8" htmlFor="uid_5">Email or Phone Number<span className="style-9">*</span></label>
                <input onChange={(e) => setEmail(e.target.value)} className="style-11" type="email" id="email" name="email"></input>
              </div>

              <div className="style-28"><label className="style-29" htmlFor="uid_8">Password<span className="style-30">*</span></label>
                <div className="style-31">
                  <input onChange={(e) => setPassword(e.target.value)} className="style-32" name="password" type="password" placeholder="" aria-label="Password"></input>
                </div>
              </div>

              <div className="style-88"><button type="submit" className="style-89">
                <div className="style-90">Log In</div>
              </button></div>

              {error && <div className="style-91">{error}</div>}

              <div className="style-94">
                Need an account? <span className="style-95"><Link href="/register">Register</Link></span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </>
  )
}

export default Login
