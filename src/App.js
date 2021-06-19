import "./App.css";
import CartPage from "./components/CartPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Verification from "./components/Verification";
import HomePage from "./components/HomePage";
import OrdersPage from "./components/OrdersPage";
import HelpCenter from "./components/HelpCenter";
import UserProfile from "./components/UserProfile";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./app/counterSlice";
import { auth, db } from "./firebase";
import "./styles/HomePage.css";
import ItemDetails from "./components/ItemDetails";

function App() {
  const [getAllUsers, setGetAllUsers] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    db.collection("ShoppingApp")
      .doc("1")
      .collection("Users")
      .onSnapshot((snapshot) =>
        setGetAllUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data(),
          }))
        )
      );
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        getAllUsers.map((e) => {
          if (e.user.id === user.uid) {
            dispatch(
              login({
                Name: e.user.name,
                DOB: e.user.DOB,
                email: e.user.Email,
                name: e.user.name,
                gender: e.user.Gender,
                phone: e.user.PhoneNumber,
                id: e.id,
                address: e.user.Address,
                timestamp: new Date(e.user.timestamp?.toDate()).toString(),
                AvatarSrc: e.user.AvatarSrc,
              })
            );
          }
        });
      } else {
        auth.signOut();
        dispatch(logout());
      }
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/help_center">
            <HelpCenter />
          </Route>
          <Route exact path="/item/:id">
            <ItemDetails />
          </Route>

          <Route exact path="/orders/:id">
            <OrdersPage />
          </Route>
          <Route exact path="/cart/:id">
            <CartPage />
          </Route>
          <Route exact path="/userprofile/:id">
            <UserProfile />
          </Route>
          <Route exact path="/verification">
            <Verification />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
