import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import BodyPage from "./BodyPage";
import Header from "./Header";
import { db } from "../firebase";
import { WindMillLoading } from "react-loadingg";
function HomePage() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
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
  }, []);
  if (categories.length > 0 && allProducts.length > 0) {
    return (
      <div className="homePage">
        <Header className="HeaderComp" />
        <BodyPage />
      </div>
    );
  } else {
    return <WindMillLoading size="large" />;
  }
}

export default HomePage;
