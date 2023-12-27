import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavLink from "./shared/NavLink";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none"}}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavLink
                bg="#00fffc"
                to="/chat"
                text="Start Now"
                textColor="black"
              />
              <NavLink
                bg="51538f"
                textColor="white"
                to="/logout"
                text="logout"
                onClick={auth?.logout}
              />
            </>
          ) : (
            <>
            <NavLink
              bg="#00fffc"
              to="/login"
              text="Login"
              textColor="black"
            />
            <NavLink
              bg="51538f"
              textColor="white"
              to="/signup"
              text="Signup"
            />
          </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
