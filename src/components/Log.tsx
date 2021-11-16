import Button from "@mui/material/Button";
import { authHandle } from "../firebase/client";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./Loading";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

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
        endIcon={<LogoutIcon />}
      >
        SignOut
      </Button>
    );
  }
  return (
    <Button
      variant="contained"
      onClick={() => window.location.replace("/signin")}
      startIcon={<LoginIcon />}
    >
      Sign In
    </Button>
  );
};

export default Log;
