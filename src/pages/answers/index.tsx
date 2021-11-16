/* eslint-disable react-hooks/exhaustive-deps */
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { authHandle, storeHandle } from "../../firebase/client";
import AnswerCard from "../../components/AnswerCard";
import {
  getDoc,
  doc,
  where,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const Browse = () => {

  const [answers, setAnswers] = useState([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    const ansRef = collection(storeHandle, "answers");
    if (searchString.length > 0) {
      const q = query(
        ansRef,
        where("tags", "array-contains", searchString.split(" ").join("_").toLowerCase()),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      setAnswers([]);
      getDocs(q).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().isPrivate == false) {
            setAnswers([...answers, doc.id]);
            console.log("Doc: ", doc.id);
          }
          else {
            if(authHandle.currentUser && doc.data().creatorid == authHandle.currentUser.uid) {
              setAnswers([...answers, doc.id]);
              console.log("Doc: ", doc.id);
            }
          }
        });
      });
    } else {
      const q = query(ansRef, orderBy("createdAt", "desc"), limit(20));
      setAnswers([]);
      getDocs(q).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().isPrivate == false) {
            setAnswers([...answers, doc.id]);
            console.log("Doc: ", doc.id);
          }
          else {
            if(authHandle.currentUser && doc.data().creatorid == authHandle.currentUser.uid) {
              setAnswers([...answers, doc.id]);
              console.log("Doc: ", doc.id);
            }
          }
        });
      });
    }
    console.log("All answers", answers);
  }, [searchString]);

  

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h4" sx={{ mt: "1.5rem" }}>
        Answers
      </Typography>
      <Box sx={{my: "1rem"}}>
        <TextField
          label="Search"
          id="string"
          name="string"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          fullWidth
        />
      </Box>
      {answers.length>0 ? (
        answers.map((ans) => {
          return (
            <AnswerCard
              ansid={ans}
              key={ans}
            />
          );
        })
      ) : (
        <Typography variant="h6" sx={{ my: "2rem" }}>
          Oops, cannot find any answers with that title or tag
        </Typography>
      )}
    </Box>
  );
};

export default Browse;
