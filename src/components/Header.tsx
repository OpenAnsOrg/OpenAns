import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { authHandle } from "../firebase/client";
import Logo from "../../public/Logo.png";

import Menu from "./Menu";
import Loading from "./Loading";
import Log from "./Log";

const Header = () => {
  const [user, loading] = useAuthState(authHandle);
  if (loading) {
    return <Loading />;
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "background.default" }}>
        <Toolbar
          sx={{ px: ".2rem", display: "flex", justifyContent: "space-between" }}
        >
          <Button variant="text" href="/">
            <Image src={Logo} alt="OpenAns" width={30} height={30} />
            <Typography
              variant="h6"
              sx={{
                color: "whitesmoke",
                fontWeight: "bold",
                fontSize: "16px",
                mx: ".2rem",
              }}
            >
              OpenAns
            </Typography>
          </Button>
          {user ? (
            <Box>
              <Menu />
            </Box>
          ) : (
            <Log />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
