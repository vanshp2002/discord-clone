"use client";

import "./register.css";
import React from "react";
import Dropdown from "../../../../components/ui/Dropdown/Dropdown.js";

import { useRouter } from "next/navigation";

function App() {

    const [email, setEmail] = React.useState("");
    const [displayname, setDisplayname] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [day, setDay] = React.useState("");
    const [month, setMonth] = React.useState("");
    const [year, setYear] = React.useState("");

    const [error,seterror] = React.useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || displayname === "" || username === "" || password === "") {
            seterror("Please fill in all fields");
            return;
        }

        try{

            const resUserExists = await fetch("/api/userExists", {
                method : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email
                })
            });

            const {user} = await resUserExists.json();
            if (user) {
                seterror("User already exists");
                return;
            }


            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        displayname: displayname,
                        username: username,
                        password: password,
                    })
                });

                if(res.ok) {
                    const form = e.target;
                    form.reset();
                    router.push("/login");
                }
                else {
                    console.log("reg failed");
                }
        }
        catch(err) {
            console.log("error during reg:", err);
        }
    }


  return (
    <div className="style-0">
        
      <div className="style-1">
          <form onSubmit={handleSubmit} data-theme="dark" className="style-2">
              <div className="style-3"></div>
              <div className="style-4">
                  <h1 className="style-5" data-text-variant="heading-xl/semibold">Create an account</h1>
                  <div className="style-6">
                      <div className="style-7"><label className="style-8" htmlFor="uid_5">Email<span className="style-9">*</span></label>
                          <div className="style-10">
                            <input onChange={(e) => setEmail(e.target.value)} className="style-11" name="email" type="email" id="email"></input>
                            </div>
                      </div>
                      <div className="style-12"><label className="style-13" htmlFor="uid_6">Display Name</label>
                          <div className="style-14">
                            <input onChange={(e) => setDisplayname(e.target.value)} className="style-15" name="displayname" type="text" id="displayname"></input>
                          </div>
                      </div>
                      <div className="style-16">
                          <div className="style-17">
                              <div className="style-18" data-text-variant="text-sm/normal">This is how others see you. You can use special characters and emojis.</div>
                          </div>
                      </div>
                      <div tabIndex={-1} className="style-19">
                          <div className="style-20"><label className="style-21" htmlFor="uid_7">Username<span className="style-22">*</span></label>
                              <div className="style-23">
                                <input onChange={(e) => setUsername(e.target.value)} className="style-24" name="username" type="text" id="username"></input></div>
                          </div>
                          <div className="style-25">
                              <div className="style-26">
                                  <div className="style-27" data-text-variant="text-sm/normal">Please only use numbers, letters, underscores _ or full stops.</div>
                              </div>
                          </div>
                      </div>
                      <div className="style-28"><label className="style-29" htmlFor="uid_8">Password<span className="style-30">*</span></label>
                          <div className="style-31"><input onChange={(e) => setPassword(e.target.value)} className="style-32" name="password" type="password" id="password"></input>
                          </div>
                      </div>
                      <fieldset className="style-33">
                          <legend className="style-34">Date of birth<span className="style-35">*</span></legend>
                          <div className="style-36">
  
                          <Dropdown day={undefined} month={undefined} year={undefined} />
  
                          </div>
                      </fieldset>
  
                      <div className="style-88">
                        <button type="submit" className="style-89">
                              <div className="style-90">Continue</div>
                          </button></div>

                          {error && (<div className="style-95">{error}</div>)}
                      <div className="style-91" data-text-variant="text-xs/normal">By registering, you agree to Discords <a className="style-92" href="//discord.com/terms" rel="noreferrer noopener" target="_blank">Terms of Service</a> and <a className="style-93" href="//discord.com/privacy" rel="noreferrer noopener" target="_blank">Privacy Policy</a>.</div>
                      
                      <div className="style-94">
                          <div className="style-95">Already have an account?</div>
                      </div>
                  </div>
              </div>
          </form>
      </div>
    </div>
  );
}

export default App;
