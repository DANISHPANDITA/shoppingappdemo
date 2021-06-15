import { Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { removeItemFromCartArray, selectUser } from "../app/counterSlice";
import image from "../img/headerlogo.png";
import "../styles/CartPage.css";
import { MeteorRainLoading } from "react-loadingg";
function CartPage() {
  const history = useHistory();
  const loggedInUser = useSelector(selectUser);
  const [Cart, setCart] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    db.collection("ShoppingApp")
      .doc("1")
      .collection("Users")
      .doc(loggedInUser.id)
      .collection("Cart")
      .onSnapshot((snapshot) =>
        setCart(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            CartItem: doc.data(),
          }))
        )
      );
  }, [loggedInUser]);
  const cutDescString = (d) => {
    var f = "";
    if (d.length > 30) {
      var e = d.slice(0, 30);
      f = e.join(" ");
    } else f = d.join(" ");
    return f;
  };
  const checkout = () => {
    const a = window.confirm("Are you sure you want to checkout Now");
    if (a) {
      console.log(a);
    }
  };
  const removeFromCart = (e) => {
    for (var k = 0; k < Cart.length; k++) {
      if (Cart[k].CartItem._id.$oid === e) {
        db.collection("ShoppingApp")
          .doc("1")
          .collection("Users")
          .doc(loggedInUser.id)
          .collection("Cart")
          .doc(Cart[k].id)
          .delete()
          .then(() => {
            dispatch(removeItemFromCartArray(e));
            alert("Item successfully removed from Basket 🙂");
          })
          .catch((error) => {
            alert("Error removing document 😧  : ", error.message);
          });
      }
    }
  };
  var cc = 0;
  if (Cart.length > 0) {
    for (var i = 0; i < Cart.length; i++) {
      cc += Cart[i].CartItem.price;
    }
  }
  if (Cart.length > 0) {
    return (
      <div className="cartPage">
        <div className="cartPageHeader">
          <Tooltip title="Go to Home">
            <img
              onClick={() => {
                history.push("/");
              }}
              src={image}
              alt=""
            />
          </Tooltip>
          <h1>Your Cart ({Cart.length})</h1>
          {loggedInUser ? (
            <button
              onClick={() => {
                history.push(`/userprofile/${loggedInUser?.id}`);
              }}
            >
              My Account
            </button>
          ) : (
            <button
              onClick={() => {
                history.push("/login");
              }}
            >
              Login
            </button>
          )}
        </div>
        <div className="cartPageBody">
          <div className="cartPageItems">
            {Cart.length > 0 ? (
              Cart.map((cartItem) => {
                return (
                  <div className="cartItemShow" key={cartItem.id}>
                    <img src={cartItem.CartItem.images.large.url} alt="" />
                    <div className="cartItemDetailShow">
                      <p className="cartItemDetailShowTitle">
                        {cartItem.CartItem.title}
                      </p>
                      {cartItem.CartItem.label.length > 0 && (
                        <p className="cartItemDetailShowLabel">
                          -{cartItem.CartItem.label}
                        </p>
                      )}
                      <p className="cartItemDetailShowDesc">
                        {cutDescString(
                          cartItem.CartItem.description[0].split(" ")
                        )}
                        ...
                      </p>
                      {cartItem.CartItem.price > 0 ? (
                        <p className="cartItemDetailShowPrice">
                          <b>{cartItem.CartItem.currency}</b>{" "}
                          {cartItem.CartItem.price}
                        </p>
                      ) : (
                        <p className="cartItemDetailShowPrice">
                          Not yet Available
                        </p>
                      )}
                      <div className="cartItemDetailShowFooter">
                        <button
                          onClick={() => {
                            history.push(`/item/${cartItem.CartItem._id.$oid}`);
                          }}
                          className="cartItemDetailShowGoto"
                        >
                          Go to item
                        </button>
                        <button
                          onClick={() => {
                            removeFromCart(cartItem.CartItem._id.$oid);
                          }}
                          className="cartItemDetailShowRemove"
                        >
                          Remove From Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No item in the cart</p>
            )}
          </div>
          <div className="checkoutComponent">
            <div className="checkout">
              <p className="checkoutTitle">Cart Basket Checkout</p>
              <div className="productCountRow">
                <p>Total Items</p>
                <p>{Cart.length}</p>
              </div>
              <div className="productCountRow">
                <p>Total Amount</p>
                <p>${cc}</p>
              </div>
              <center>
                <button onClick={checkout} className="checkoutButton">
                  Checkout
                </button>
                <button onClick={checkout} className="emptyCartButton">
                  Empty Cart
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <MeteorRainLoading size="large" />;
  }
}
export default CartPage;
