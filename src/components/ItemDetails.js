import React, { useEffect, useState } from "react";
import "../styles/ItemDetails.css";
import { db } from "../firebase";
import { useHistory, useParams } from "react-router-dom";
import dataImage from "../img/headerlogo.png";
import { useDispatch, useSelector } from "react-redux";
import { addToCartArray, selectCart, selectUser } from "../app/counterSlice";
import { MenuItem, Menu, Fade } from "@material-ui/core";
import { FaStar } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import { FcHome } from "react-icons/fc";
import { RiSettings4Fill } from "react-icons/ri";
function ItemDetails() {
  var item = [];
  const [ReadMoreState, setReadMoreState] = useState(false);
  const id = useParams();
  const cart = useSelector(selectCart);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [AllProducts, setAllProducts] = useState([]);
  var itemRatings;

  useEffect(() => {
    db.collection("ShoppingApp")
      .doc("2")
      .collection("Items")
      .onSnapshot((snapshot) =>
        setAllProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            item: doc.data(),
          }))
        )
      );
  }, [user, id]);

  item = AllProducts.filter((e) => e.item._id.$oid === id.id);
  if (item[0]?.item.rating > 0) {
    itemRatings = Array.from(
      { length: item[0]?.item.rating },
      (_, index) => index + 1
    );
  }
  const cutDescString = (d) => {
    var f = "";
    if (d.length > 30) {
      var e = d.slice(0, 30);
      f = e.join(" ");
    } else f = d.join(" ");
    return f;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const addToCart = () => {
    const findInCart = cart.filter((c) => c === item[0]?.item._id.$oid);
    if (findInCart.length > 0) {
      alert("Item already in cart");
    } else {
      db.collection("ShoppingApp")
        .doc("1")
        .collection("Users")
        .doc(user.id)
        .collection("Cart")
        .add(item[0]);
      dispatch(addToCartArray(item[0].item._id.$oid));
      alert("Added to cart");
    }
  };
  if (item.length > 0) {
    return (
      <div
        className={`${ReadMoreState ? "itemDetailPage" : "itemDetailPageFull"}`}
      >
        <div className="itemDetailPageTop">
          <img className="headerlogo" src={dataImage} alt="" />
          <h1>Shopify Online</h1>
          {window.innerWidth > 420 ? (
            <div className="itemDetailPageTopRight">
              <button
                onClick={() => {
                  history.push(`/cart/${user?.id}`);
                }}
              >
                Go to cart
              </button>
              <button
                onClick={() => {
                  history.push("/");
                }}
              >
                Go to Home
              </button>
            </div>
          ) : (
            <div className="itemDetailPageTopRight">
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
                    paddingTop: "0.3vw",
                    paddingBottom: "0.3vw",
                    fontSize: "small",
                    fontFamily: "Cochin",
                  }}
                  className="moreOptionItem"
                  onClick={() => {
                    history.push(`/cart/${user?.id}`);
                  }}
                >
                  <HiShoppingCart style={{ marginRight: "1vw" }} />
                  <p style={{ fontFamily: "Cochin" }}>
                    My Cart Items <b style={{ marginLeft: "1vw" }}> 0</b>
                  </p>
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
                    history.push("/");
                  }}
                >
                  <FcHome style={{ marginRight: "1vw" }} />
                  <p style={{ fontFamily: "Cochin" }}>
                    Go to Home <b style={{ marginLeft: "1vw" }}></b>
                  </p>
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <div className="selectedItemDetails">
          <img src={item[0]?.item.images?.large.url} alt="" />
          <div className="selectedItemDetailsRight">
            <h2>{item.title}</h2>
            <table>
              <tbody>
                {item[0]?.item &&
                  item[0]?.item.feature?.map((row) => {
                    return <tr className="itemFeatureRow">{row}</tr>;
                  })}
              </tbody>
            </table>
            {item[0]?.item.description?.length > 0 && (
              <p className="ItemDesc">
                {cutDescString(item[0].item.description[0].split(" "))} ...
                <span
                  onClick={() => {
                    setReadMoreState(true);
                  }}
                >
                  Read More
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="editionPriceCartOptions">
          {item[0]?.item.edition ? (
            <p className="editionType">Edition - {item[0]?.item.edition}</p>
          ) : (
            <p className="editionType">Edition not known</p>
          )}

          {item[0]?.item.price > 0 ? (
            <p className="editionType">
              $ {item[0]?.item.price} {item[0]?.item.currency}
            </p>
          ) : (
            <p className="editionType">Not available yet</p>
          )}
          {item[0]?.item.price ? (
            <p onClick={addToCart} className="editionTypeCart">
              Add to Cart
            </p>
          ) : (
            <p className="editionTypeCart">Can't add to cart.</p>
          )}
        </div>
        <div className="ratingsForProduct">
          <p>Ratings : </p>
          {itemRatings &&
            itemRatings.map((i) => {
              return <FaStar className="ratingsStar" />;
            })}
        </div>
        {ReadMoreState && (
          <div className="readMoreState">
            <center>
              <h2 className="itemDescHead">Description</h2>
              <p className="itemDescPara">{item[0]?.item.description[0]}</p>
              <table className="itemMoreDetailsTable">
                <tbody>
                  {item[0]?.item.metadata.map((meta) => {
                    if (typeof meta.value === "string") {
                      return (
                        <tr className="itemMoreDetailsTableRow">
                          <td className="itemMoreDetailsTableRowTitle">
                            {meta.key.toUpperCase()}
                          </td>
                          {meta.value === "0" ? (
                            <td>NO</td>
                          ) : meta.value === "1" ? (
                            <td>YES</td>
                          ) : (
                            <td>{meta.value.toUpperCase()}</td>
                          )}
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </center>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="itemDetailsLoadingPage">
        <h1>Loading......</h1>
      </div>
    );
  }
}

export default ItemDetails;
