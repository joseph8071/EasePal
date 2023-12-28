
import { AppBar, Toolbar } from "@mui/material";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavLink from "./shared/NavLink";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavLink
                bg="#1E70DD"
                to="/chat"
                text="Create"
                textColor="white"
              />
              <NavLink
                bg="#223D66"
                textColor="white"
                to="/logout"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavLink
                bg="#1E70DD"
                to="/login"
                text="Login"
                textColor="white"
              />
              <NavLink
                bg="#223D66"
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
