import React, { useEffect, useState } from "react";
import "../styles/BodyPage.css";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCategory,
  selectCategory,
  selectSearchInput,
} from "../app/counterSlice";
function BodyPage() {
  const [categories, setCategories] = useState([]);
  const searchData = useSelector(selectSearchInput);
  const [categoryState, setCategoryState] = useState(false);
  const [AllProducts, setAllProducts] = useState([]);
  var [randomNumber, setRandomNumber] = useState(0);
  const history = useHistory();
  const dispatch = useDispatch();
  const categorySelected = useSelector(selectCategory);
  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 1000));
    if (window.innerWidth < 701) {
      setCategoryState(true);
    }
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
  return (
    <div className="bodyPage">
      {categoryState && categories && (
        <div className="categoriesforsmallscreens">
          <p className="categoryTitle">Categories</p>
          <div className="horizontalCategories">
            {categories.map((c) => {
              if (c.category.name === "/") {
                return (
                  <div
                    className={`${
                      categorySelected === "/" ? "category_default" : "category"
                    }`}
                    key={categories.indexOf(c)}
                  >
                    <p
                      onClick={() => {
                        dispatch(changeCategory("/"));
                      }}
                    >
                      All items
                    </p>
                  </div>
                );
              } else {
                return (
                  <div
                    className={`${
                      categorySelected === c.category.name
                        ? "category_default"
                        : "category"
                    }`}
                    key={categories.indexOf(c)}
                    onClick={() => {
                      dispatch(changeCategory(c.category.name));
                    }}
                  >
                    <p>{c.category.name}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
      <div className="coverProduct">
        <center>
          <img
            className="coverImage"
            src={AllProducts[randomNumber]?.item.images.large.url}
            alt=""
            onClick={() => {
              history.push(`/item/${AllProducts[randomNumber]?.item._id.$oid}`);
            }}
          />
        </center>
      </div>

      <div className="productsShow">
        {categorySelected === "/"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              return (
                <div loading="lazy" className="item" key={e.id}>
                  <img
                    loading="lazy"
                    className="itemPhoto"
                    src={e.item.images.large.url}
                    alt=""
                  />
                  <div className="itemDetails">
                    <p className="itemTitle">{e.item.title}</p>
                    {e.item.price ? (
                      <b className="priceTag">$ {e.item.price} </b>
                    ) : (
                      <b className="priceTag">Item not available</b>
                    )}
                  </div>
                  {
                    <button
                      onClick={() => {
                        history.push(`/item/${e.item._id.$oid}`);
                      }}
                      className="addtocartbutton"
                    >
                      See Details
                    </button>
                  }
                </div>
              );
            })
          : categorySelected === "ps4"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/games/ps4") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : categorySelected === "ps3"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/games/ps3") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : categorySelected === "history"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/books/history") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : categorySelected === "books"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              var zz = e.item.category;
              if (zz?.match("/books")) {
                if (zz?.match("/books").length > 0) {
                  return (
                    <div loading="lazy" className="item" key={e.id}>
                      <img
                        loading="lazy"
                        className="itemPhoto"
                        src={e.item.images.large.url}
                        alt=""
                      />
                      <div className="itemDetails">
                        <p className="itemTitle">{e.item.title}</p>
                        {e.item.price ? (
                          <b className="priceTag">$ {e.item.price} </b>
                        ) : (
                          <b className="priceTag">Item not available</b>
                        )}
                      </div>
                      {
                        <button
                          onClick={() => {
                            history.push(`/item/${e.item._id.$oid}`);
                          }}
                          className="addtocartbutton"
                        >
                          See Details
                        </button>
                      }
                    </div>
                  );
                }
              }
            })
          : categorySelected === "games"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              var zz = e.item.category;
              if (zz?.match("/games")) {
                if (zz?.match("/games").length > 0) {
                  return (
                    <div loading="lazy" className="item" key={e.id}>
                      <img
                        loading="lazy"
                        className="itemPhoto"
                        src={e.item.images.large.url}
                        alt=""
                      />
                      <div className="itemDetails">
                        <p className="itemTitle">{e.item.title}</p>
                        {e.item.price ? (
                          <b className="priceTag">$ {e.item.price} </b>
                        ) : (
                          <b className="priceTag">Item not available</b>
                        )}
                      </div>
                      {
                        <button
                          onClick={() => {
                            history.push(`/item/${e.item._id.$oid}`);
                          }}
                          className="addtocartbutton"
                        >
                          See Details
                        </button>
                      }
                    </div>
                  );
                }
              }
            })
          : categorySelected === "xbox360"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              var zz = e.item.category;
              if (zz?.match("/xbox360")) {
                if (zz?.match("/xbox360").length > 0) {
                  return (
                    <div loading="lazy" className="item" key={e.id}>
                      <img
                        loading="lazy"
                        className="itemPhoto"
                        src={e.item.images.large.url}
                        alt=""
                      />
                      <div className="itemDetails">
                        <p className="itemTitle">{e.item.title}</p>
                        {e.item.price ? (
                          <b className="priceTag">$ {e.item.price} </b>
                        ) : (
                          <b className="priceTag">Item not available</b>
                        )}
                      </div>
                      {
                        <button
                          onClick={() => {
                            history.push(`/item/${e.item._id.$oid}`);
                          }}
                          className="addtocartbutton"
                        >
                          See Details
                        </button>
                      }
                    </div>
                  );
                }
              }
            })
          : categorySelected === "pc"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/games/pc") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : categorySelected === "wiiu"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/games/wiiu") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : categorySelected === "programming"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/books/programming") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : categorySelected === "business"
          ? AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/books/business") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })
          : AllProducts.filter((data) => {
              if (searchData == null) return data;
              else if (data.item.title.toLowerCase().includes(searchData)) {
                return data;
              }
            }).map((e) => {
              if (e.item.category === "/books/cooking") {
                return (
                  <div loading="lazy" className="item" key={e.id}>
                    <img
                      loading="lazy"
                      className="itemPhoto"
                      src={e.item.images.large.url}
                      alt=""
                    />
                    <div className="itemDetails">
                      <p className="itemTitle">{e.item.title}</p>
                      {e.item.price ? (
                        <b className="priceTag">$ {e.item.price} </b>
                      ) : (
                        <b className="priceTag">Item not available</b>
                      )}
                    </div>
                    {
                      <button
                        onClick={() => {
                          history.push(`/item/${e.item._id.$oid}`);
                        }}
                        className="addtocartbutton"
                      >
                        See Details
                      </button>
                    }
                  </div>
                );
              }
            })}
      </div>
    </div>
  );
}

export default BodyPage;
