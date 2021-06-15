import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  AddnlDataForUser,
  ChangeDOBForUser,
  ChangeAddressForUser,
  ChangeNameForUser,
} from "../app/counterSlice";
import "../styles/UserProfile.css";
import validator from "validator";
import { FiEdit2 } from "react-icons/fi";
import {
  makeStyles,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
} from "@material-ui/core";
import { storage, db } from "../firebase";
import firebase from "firebase";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function UserProfile() {
  const dispatch = useDispatch();
  const registeredUser = useSelector(selectUser);
  const history = useHistory();
  const classes = useStyles();
  const handleClose = () => {
    setModalState(false);
  };
  const profileId = useParams();
  const [changeOption, setChangeOption] = useState("");
  const [changedData, setChangedData] = useState("");
  const [originalData, setOriginalData] = useState("");
  const [modalState, setModalState] = useState(false);
  const changeProfileData = (data, data1) => {
    var d = window.confirm(`Do you want to change ${data}`);
    if (d) {
      setModalState(true);
      setChangeOption(data);
      setOriginalData(data1);
    }
  };
  const onExitModal = (e) => {
    e.preventDefault();
    if (changeOption === "Name") {
      db.collection("ShoppingApp")
        .doc("1")
        .collection("Users")
        .doc(profileId.id)
        .update({
          name: changedData,
        });
      dispatch(ChangeNameForUser(changedData));
    } else if (changeOption === "DOB") {
      if (validator.isISO8601(changedData)) {
        db.collection("ShoppingApp")
          .doc("1")
          .collection("Users")
          .doc(profileId.id)
          .update({
            DOB: changedData,
          });
        dispatch(ChangeDOBForUser(changedData));
      } else {
        alert("Keep DOB format as yyyy-mm-dd");
      }
    } else {
      db.collection("ShoppingApp")
        .doc("1")
        .collection("Users")
        .doc(profileId.id)
        .update({
          Address: changedData,
        });
      dispatch(ChangeAddressForUser(changedData));
    }
    setModalState(false);
    setChangedData("");
    setChangeOption("");
  };
  function buildFileSelector() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", "image/*");
    return fileSelector;
  }

  const changePhoto = (e) => {
    e.preventDefault();
    const fileSelector = buildFileSelector();
    fileSelector.click();
    fileSelector.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const uploadTask = storage.ref(`UserImages/${file.name}`).put(file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log("Upload is running");
                break;
              default:
                console.log("..");
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              db.collection("ShoppingApp")
                .doc("1")
                .collection("Users")
                .doc(profileId.id)
                .update({
                  AvatarSrc: downloadURL,
                });
              dispatch(AddnlDataForUser(downloadURL));
            });
            alert("Image Uploaded.");
          }
        );
      }
    });
  };
  return (
    <div className="userProfile">
      <Avatar className="avatarProfile" src={registeredUser.AvatarSrc} alt="" />
      <center>
        <p
          onClick={changePhoto}
          style={{
            color: "indigo",
            fontWeight: "bolder",
            cursor: "pointer",
            marginTop: "1vh",
            fontSize: "small",
            textAlign: "center",
            width: "fit-content",
          }}
        >
          Upload/Change Image
        </p>
      </center>
      <p
        style={{
          marginTop: "1vh",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        ** Account created on <b>{registeredUser.timestamp.slice(0, 15)}</b> at{" "}
        <b>{registeredUser.timestamp.slice(16, 24)}</b> **
      </p>
      <div className="userDetails">
        <div className="USERDETAIL">
          <h3>
            Name
            <FiEdit2
              className="editProfileOption"
              onClick={() => {
                var a = "Name";
                var a1 = registeredUser.Name;
                changeProfileData(a, a1);
              }}
            />
          </h3>
          <p>{registeredUser.Name}</p>
        </div>
        <div className="USERDETAIL">
          <h3>E-Mail</h3>
          <p>{registeredUser.email}</p>
        </div>
        <div className="USERDETAIL">
          <h3>Phone Number</h3>
          <p>{registeredUser.phone}</p>
        </div>
        <div className="USERDETAIL">
          <h3>
            Date of Birth<small> (yyyy-mm-dd)</small>
            <FiEdit2
              className="editProfileOption"
              onClick={() => {
                let c = "DOB";
                let c1 = registeredUser.DOB;
                changeProfileData(c, c1);
              }}
            />
          </h3>
          <p>{registeredUser.DOB}</p>
        </div>
        <div className="USERDETAIL">
          <h3>Gender</h3>
          <p>Male</p>
        </div>
        <div className="USERDETAIL">
          <h3>
            Default Address
            <FiEdit2
              className="editProfileOption"
              onClick={() => {
                let b = "Address";
                let b1 = registeredUser.address;
                changeProfileData(b, b1);
              }}
            />
          </h3>
          {registeredUser.address.length === 0 ? (
            <p>No address saved yet</p>
          ) : (
            <p>{registeredUser.address}</p>
          )}
        </div>
      </div>
      {modalState && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={modalState}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalState}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Change {changeOption}</h2>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  onChange={(e) => setChangedData(e.target.value)}
                  id="standard-basic"
                  label="New Profile Data"
                  placeholder={originalData}
                />
                <Button
                  disabled={!changedData}
                  variant="contained"
                  color="primary"
                  onClick={onExitModal}
                >
                  Change Data
                </Button>
              </form>
            </div>
          </Fade>
        </Modal>
      )}
      <center>
        <button
          onClick={() => {
            history.push("/");
          }}
          className="goToHomeButton"
        >
          Go To Home
        </button>
      </center>
    </div>
  );
}

export default UserProfile;
