import React, { useEffect, useState } from "react";
import "../styles/Header.css";
import image from "../img/headerlogo.png";
import { SearchRounded, ShoppingCartRounded } from "@material-ui/icons";
import { Tooltip, Avatar, MenuItem, Menu, Fade } from "@material-ui/core";
import { RiSettings4Fill, RiAccountPinBoxFill } from "react-icons/ri";
import { HiShoppingCart } from "react-icons/hi";
import { FcConferenceCall } from "react-icons/fc";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSearchData,
  clearSearchData,
  logout,
  selectUser,
  changeCategory,
} from "../app/counterSlice";
import { db } from "../firebase";
function Header() {
  const loggedInUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  useEffect(() => {
    dispatch(clearSearchData());
    db.collection("ShoppingApp")
      .doc("3")
      .collection("ItemCategories")
      .onSnapshot((snapshot) =>
        setCategories(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            category: doc.data(),
          }))
        )
      );
  }, [dispatch]);
  dispatch(changeSearchData(inputText));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <img className="headerlogo" src={image} alt="Coudn't load" />
      <div className="inputelement">
        {window.innerWidth > 701 && (
          <select
            onChange={(e) => dispatch(changeCategory(e.target.value))}
            className="selectCategories"
          >
            {categories.map((data) => {
              if (data.category.name === "/") {
                return (
                  <option
                    key={data.category.name}
                    className="optionForCategory"
                    value={data.category.name}
                  >
                    All items
                  </option>
                );
              }
              return (
                <option
                  key={data.category.name}
                  className="optionForCategory"
                  value={data.category.name}
                >
                  {data.category.name}
                </option>
              );
            })}
          </select>
        )}

        <input
          placeholder="...Search for your item"
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          className="inputElement"
        />
        <SearchRounded className="searchButton" />
      </div>
      {window.innerWidth > 700 ? (
        <div className="rightHeader">
          <Tooltip
            title="Items in cart"
            arrow
            enterDelay={500}
            leaveDelay={200}
          >
            <div
              className="carticon"
              onClick={() => {
                if (loggedInUser) {
                  history.push(`/cart/${loggedInUser?.id}`);
                } else {
                  alert("Please login first");
                }
              }}
            >
              <ShoppingCartRounded className="cartIcon" />
            </div>
          </Tooltip>
          <Tooltip
            arrow
            enterDelay={500}
            leaveDelay={200}
            title={loggedInUser && loggedInUser.Name}
          >
            <Avatar
              className="avatar"
              src={loggedInUser?.AvatarSrc}
              alt="Coudn't load"
              aria-controls="fade-menu"
              aria-haspopup="true"
              onClick={handleClick}
            />
          </Tooltip>
          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem
              style={{
                paddingTop: "0.3vh",
                paddingBottom: "0.3vw",
                fontSize: "small",
              }}
              className="moreOptionItem"
              onClick={() => {
                if (loggedInUser && Object.keys(loggedInUser).length > 0) {
                  history.push(`/userprofile/${loggedInUser?.id}`);
                } else {
                  alert("Log in first");
                }
              }}
            >
              <RiAccountPinBoxFill style={{ marginRight: "1vw" }} />
              <p style={{ fontFamily: "Cochin" }}>Profile</p>
            </MenuItem>
            <MenuItem
              style={{
                paddingTop: "0.3vw",
                paddingBottom: "0.3vw",
                fontSize: "small",
                fontFamily: "Cochin",
              }}
              className="moreOptionItem"
              onClick={() => {
                if (loggedInUser) {
                  history.push(`/orders/${loggedInUser?.id}`);
                } else {
                  alert("Log in first..");
                }
              }}
            >
              <HiShoppingCart style={{ marginRight: "1vw" }} />
              <p
                style={{
                  fontFamily: "Cochin",
                  borderBottom: "grey 1px solid",
                }}
              >
                My Orders
              </p>
            </MenuItem>
            {loggedInUser ? (
              <MenuItem
                style={{
                  paddingTop: "0.3vw",
                  paddingBottom: "0.3vw",
                  fontSize: "small",
                  fontFamily: "Cochin",
                }}
                className="moreOptionItem"
                onClick={() => {
                  dispatch(logout());
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                <p style={{ fontFamily: "Cochin" }}>Logout</p>
              </MenuItem>
            ) : (
              <MenuItem
                style={{
                  paddingTop: "0.3vw",
                  paddingBottom: "0.3vw",
                  fontSize: "small",
                  fontFamily: "Cochin",
                }}
                className="moreOptionItem"
                onClick={() => {
                  history.push("/login");
                }}
              >
                <p style={{ fontFamily: "Cochin" }}>Login</p>
              </MenuItem>
            )}

            <MenuItem
              style={{
                paddingTop: "0.3vw",
                paddingBottom: "0.3vw",
                fontSize: "small",
                fontFamily: "Cochin",
                borderTop: "1px grey solid",
              }}
              className="moreOptionItem"
              onClick={() => {
                history.push("/help_center");
              }}
            >
              <FcConferenceCall style={{ marginRight: "1vw" }} />
              <p
                style={{
                  fontFamily: "Cochin",
                }}
              >
                Help Center
              </p>
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div className="rightHeader">
          <RiSettings4Fill
            aria-controls="fade-menu"
            className="moreOptions"
            aria-haspopup="true"
            onClick={handleClick}
          />
          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem
              style={{
                paddingTop: "0.3vh",
                paddingBottom: "0.3vw",
                fontSize: "small",
              }}
              className="moreOptionItem"
              onClick={() => {
                if (loggedInUser && Object.keys(loggedInUser).length > 0) {
                  history.push(`/userprofile/${loggedInUser?.id}`);
                } else {
                  alert("Log in first");
                }
              }}
            >
              <RiAccountPinBoxFill style={{ marginRight: "1vw" }} />
              <p style={{ fontFamily: "Cochin" }}>Profile</p>
            </MenuItem>
            <MenuItem
              style={{
                paddingTop: "0.3vw",
                paddingBottom: "0.3vw",
                fontSize: "small",
                fontFamily: "Cochin",
              }}
              className="moreOptionItem"
              onClick={() => {
                if (loggedInUser) {
                  history.push(`/cart/${loggedInUser?.id}`);
                } else {
                  alert("Please login first");
                }
              }}
            >
              <HiShoppingCart style={{ marginRight: "1vw" }} />
              <p style={{ fontFamily: "Cochin" }}>My Cart Items</p>
            </MenuItem>
            <MenuItem
              style={{
                paddingTop: "0.3vw",
                paddingBottom: "0.3vw",
                fontSize: "small",
                fontFamily: "Cochin",
              }}
              className="moreOptionItem"
              onClick={() => {
                if (loggedInUser) {
                  history.push(`/orders/${loggedInUser?.id}`);
                } else {
                  alert("login first");
                }
              }}
            >
              <HiShoppingCart style={{ marginRight: "1vw" }} />
              <p
                style={{
                  fontFamily: "Cochin",
                  borderBottom: "grey 1px solid",
                }}
              >
                My Orders
              </p>
            </MenuItem>
            {loggedInUser ? (
              <MenuItem
                style={{
                  paddingTop: "0.3vw",
                  paddingBottom: "0.3vw",
                  fontSize: "small",
                  fontFamily: "Cochin",
                }}
                className="moreOptionItem"
                onClick={() => {
                  dispatch(logout());
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                <p style={{ fontFamily: "Cochin" }}>Logout</p>
              </MenuItem>
            ) : (
              <MenuItem
                style={{
                  paddingTop: "0.3vw",
                  paddingBottom: "0.3vw",
                  fontSize: "small",
                  fontFamily: "Cochin",
                }}
                className="moreOptionItem"
                onClick={() => {
                  history.push("/login");
                }}
              >
                <p style={{ fontFamily: "Cochin" }}>Login</p>
              </MenuItem>
            )}
            <MenuItem
              style={{
                paddingTop: "0.3vw",
                paddingBottom: "0.3vw",
                fontSize: "small",
                fontFamily: "Cochin",
                borderTop: "1px grey solid",
              }}
              className="moreOptionItem"
              onClick={() => {
                history.push("/help_center");
              }}
            >
              <FcConferenceCall style={{ marginRight: "1vw" }} />
              <p
                style={{
                  fontFamily: "Cochin",
                }}
              >
                Help Center
              </p>
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}

export default Header;
