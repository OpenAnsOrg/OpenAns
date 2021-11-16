import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect } from "react";
import { authHandle, storeHandle } from "../firebase/client";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const LikeSaveShare = ({ ansid }) => {
  const [likes, setLikes] = useState([]);
  const [saves, setSaves] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const docRef = doc(storeHandle, "answers", ansid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLikes(docSnap.data().likes);
        setSaves(docSnap.data().saves);
      }
    })();
  }, []);

  useEffect(() => { 
    setIsLiked(likes.includes(authHandle.currentUser?.uid || false));
    setIsSaved(saves.includes(authHandle.currentUser?.uid || false));
  }, [likes, saves]);


  const toggleLike = () => {
    if (authHandle.currentUser) {
      if (likes.includes(authHandle.currentUser.uid)) {
        setDoc(
          doc(storeHandle, "answers", ansid),
          {
            likes: arrayRemove(authHandle.currentUser.uid),
          },
          { merge: true }
        );
        setDoc(doc(storeHandle, "users", authHandle.currentUser.uid), {
          likes: arrayRemove(ansid)
        }, {merge: true})
        setIsLiked(false);
        setLikes(likes.filter((like) => like !== authHandle.currentUser.uid));
      } else {
        setDoc(
          doc(storeHandle, "answers", ansid),
          {
            likes: arrayUnion(authHandle.currentUser.uid),
          },
          { merge: true }
        );
        setDoc(doc(storeHandle, "users", authHandle.currentUser.uid), {
          likes: arrayUnion(ansid)
        }, {merge: true})
        setIsLiked(true);
        setLikes([...likes, authHandle.currentUser.uid]);
      }
    } else {
      alert("You need to be logged in to like answers")
    }
  };

  const toggleSave = () => {
    if (authHandle.currentUser) {
      if (saves.includes(authHandle.currentUser.uid)) {
        setDoc(
          doc(storeHandle, "answers", ansid),
          {
            saves: arrayRemove(authHandle.currentUser.uid),
          },
          { merge: true }
        );
        setDoc(doc(storeHandle, "users", authHandle.currentUser.uid), {
          saves: arrayRemove(ansid)
        }, {merge: true})
        setIsSaved(false);
        setSaves(saves.filter((save) => save !== authHandle.currentUser.uid));
      } else {
        setDoc(
          doc(storeHandle, "answers", ansid),
          {
            saves: arrayUnion(authHandle.currentUser.uid),
          },
          { merge: true }
        );
        setDoc(doc(storeHandle, "users", authHandle.currentUser.uid), {
          likes: arrayUnion(ansid)
        }, {merge: true})
        setIsSaved(true);
        setSaves([...saves, authHandle.currentUser.uid]);
      }
    } else {
      alert("You need to be logged in to save answers");
    }
  };
  return (
    <Box>
          <IconButton onClick={toggleLike}>
            {isLiked ? (
              <FavoriteIcon color="primary" />
            ) : (
              <FavoriteBorderIcon color="primary" />
            )}
            <Typography variant="body1" sx={{ color: "gray", mx: ".2rem" }}>
              {likes.length}
            </Typography>
          </IconButton>
          <IconButton onClick={toggleSave}>
            {isSaved ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderIcon color="primary" />
            )}
            <Typography variant="body1" sx={{ color: "gray", mx: ".2rem" }}>
              {saves.length}
            </Typography>
          </IconButton>
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(
                `openans.vercel.app/answers/${ansid}`
              );
              alert("Link copied to clipboard!");
            }}
          >
            <ShareIcon color="primary" />
          </IconButton>
        </Box>
  )
}

export default LikeSaveShare

