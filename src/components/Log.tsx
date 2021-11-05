import Button from "@mui/material/Button";
import { authHandle } from "../firebase/client";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./Loading";

const Log = () => {
  const [user, loading] = useAuthState(authHandle);
  if (loading) {
    return <Loading />;
  }
  if (user) {
    return (
      <Button
        variant="contained"
        onClick={async () => {
          await signOut(authHandle);
          window.location.replace("/signin");
        }}
      >
        SignOut
      </Button>
    );
  }
  return (
    <Button
      variant="contained"
      onClick={() => window.location.replace("/signin")}
    >
      Sign In
    </Button>
  );
};

export default Log;
