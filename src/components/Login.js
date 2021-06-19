import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import bcrypt from "bcryptjs";
import { useDispatch } from "react-redux";
import { login } from "../app/counterSlice";
function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Users, setUsers] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    db.collection("ShoppingApp")
      .doc("1")
      .collection("Users")
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data(),
          }))
        )
      );
  }, []);

  const goToRegister = () => {
    history.push("/register");
  };

  const signin = (e) => {
    e.preventDefault();
    if (email.includes("@") && email.includes(".com")) {
      Users.map((user) => {
        if (user.user.Email === email) {
          bcrypt.compare(password, user.user.password).then((res) => {
            if (res) {
              auth
                .signInWithEmailAndPassword(email, user.user.password)
                .then(() => {
                  dispatch(
                    login({
                      Name: user.user.name,
                      DOB: user.user.DOB,
                      email: user.user.Email,
                      name: user.user.name,
                      phone: user.user.PhoneNumber,
                      Address: user.user.Address,
                      timestamp: user.user.timestamp,
                      gender: user.user.Gender,
                      id:user.id,
                      AvatarSrc: user.user.AvatarSrc,
                    })
                  );
                  setEmail("");
                  setPassword("");
                  document.getElementById("loginForm").reset();
                  history.push("/");
                });
            } else {
              alert("Wrong Password");
            }
          });
        } else {
          alert("e-mail not registered");
        }
      });
    } else {
      alert("Please enter correct email");
    }
  };
  return (
    <div className="loginPage">
      <form id="loginForm" className="loginContainer">
        <h2 className="loginTitle">Sign In</h2>
        <input
          className="LoginInput"
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          className="LoginInput"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button
          disabled={!email || !password}
          className="signInButton"
          onClick={signin}
        >
          SIGNIN
        </button>
        <p className="registerLink" onClick={goToRegister}>
          Register Here
        </p>
      </form>
    </div>
  );
}

export default Login;
