import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/OrdersPage.css";
import { db } from "../firebase";
import { selectUser } from "../app/counterSlice";
function OrdersPage() {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    db.collection("ShoppingApp")
      .doc("1")
      .collection("Users")
      .doc(user.id)
      .collection("Orders")
      .onSnapshot((snapshot) =>
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            CartItem: doc.data(),
          }))
        )
      );
  }, []);
  if (orders.length === 0) {
    return (
      <div className="orders_page">
        <p>No order Placed yet</p>
      </div>
    );
  }
}

export default OrdersPage;
