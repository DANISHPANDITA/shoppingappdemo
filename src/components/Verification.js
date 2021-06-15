import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetForm, selectFormDetails } from "../app/counterSlice";
import { auth, db } from "../firebase";
import firebase from "firebase";
import bcrypt from "bcryptjs";
import "../styles/Verification.css";
import { useHistory } from "react-router-dom";
function Verification() {
  const registeredUser = useSelector(selectFormDetails);
  const [Phone, setPhone] = useState("");
  const [EmailStatus, setEmailStatus] = useState(false);
  const [OTPCode, setOTPCode] = useState("");
  const [OTPSentStatus, setOTPSentStatus] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (registeredUser) {
      setPhone(registeredUser?.PhoneNumber);
    }
  });
  const verifyMail = (e) => {
    e.preventDefault();
    setEmailStatus(true);
    auth
      .createUserWithEmailAndPassword(
        registeredUser.email,
        registeredUser.password
      )
      .then(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            alert("Wait for a few seconds.");
            await user.sendEmailVerification();
            const onIdTokenChangedUnsubscribe = firebase
              .auth()
              .onIdTokenChanged((user) => {
                if (user && user.emailVerified) {
                  alert("Verified");
                  setEmailStatus(false);
                  auth.currentUser.delete();
                  return onIdTokenChangedUnsubscribe(); //unsubscribe
                }
                setTimeout(() => {
                  firebase.auth().currentUser.reload();
                  firebase
                    .auth()
                    .currentUser.getIdToken(/* forceRefresh */ true);
                }, 5000);
              });
          }
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "ReCaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          sendOTP();
        },
        defaultCountry: "IN",
      }
    );
  };
  const sendOTP = (e) => {
    e.preventDefault();

    if (Phone.length === 10) {
      setUpRecaptcha();
      let phoneNumber = "+91" + Phone;
      let appVerifier = window.recaptchaVerifier;
      auth
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          window.confirmationResult = confirmationResult;
          alert("OTP sent on mentioned Number");
          setOTPSentStatus(true);
        })
        .catch(function (error) {
          alert(error);
        });
    }
  };

  const submitOTP = (e) => {
    e.preventDefault();
    let otpInput = OTPCode;
    let optConfirm = window.confirmationResult;
    optConfirm
      .confirm(otpInput)
      .then(function (result) {
        auth.currentUser.delete();
        setOTPSentStatus(false);
      })
      .catch(function (error) {
        alert("Incorrect OTP");
      });
  };
  const onAfterClick = (e) => {
    e.preventDefault();
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(registeredUser.password, salt, function (err, hash) {
        if (err) {
          alert(err.message);
        }
        auth
          .createUserWithEmailAndPassword(registeredUser.email, hash)
          .then(() => {
            var user = auth.currentUser;
            user.updateProfile({
              displayName: registeredUser.name,
            });
            db.collection("ShoppingApp").doc("1").collection("Users").add({
              id: user.uid,
              Email: registeredUser.email,
              name: registeredUser.name,
              password: hash,
              PhoneNumber: registeredUser.PhoneNumber,
              Gender: registeredUser.gender,
              DOB: registeredUser.dob,
              Address: "",
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              AvatarSrc: "",
            });
          })
          .catch((err) => alert(err.message));
        alert("User Created");
      });
    });
    auth.signOut();
    history.push("/login");
    dispatch(resetForm());
    localStorage.clear();
  };
  if (registeredUser) {
    return (
      <div className="verificationContainer">
        <form className="verificationForm">
          <div
            className="mailProvided"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h3>Provided Mail : </h3>
            <p>{registeredUser.email}</p>
          </div>
          <button className="verifyButton" onClick={verifyMail}>
            Click Here to verify Email
          </button>
          {EmailStatus && (
            <p className="emailText">
              Click on the link in the given mail address to verify it. Wait for
              Verification.
            </p>
          )}
          <div id="ReCaptcha-container"></div>
          <div
            className="NumberProvided"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h3>Provided Phone Number : </h3>
            <p> xxxxxx{registeredUser.PhoneNumber.slice(6, 10)}</p>
          </div>
          <button className="verifyButton" onClick={sendOTP}>
            Click Here to Send OTP on Phone Number
          </button>
          {OTPSentStatus && (
            <center>
              <input
                className="verifyOTP"
                id="otp"
                type="number"
                name="otp"
                placeholder="OTP"
                onChange={(e) => {
                  setOTPCode(e.target.value);
                }}
                required
              />
              <button
                disabled={!OTPCode}
                className="buttonForVerifyOTP"
                onClick={submitOTP}
              >
                Verify OTP
              </button>
            </center>
          )}
          <button
            style={{ marginTop: "5vh" }}
            className="verifyButton"
            onClick={onAfterClick}
          >
            Click Here After Verification
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <p>
        Can't verify without details. Click{" "}
        <b
          className="gotoregisteragain"
          onClick={() => {
            history.push("/register");
          }}
        >
          here
        </b>
      </p>
    );
  }
}

export default Verification;
