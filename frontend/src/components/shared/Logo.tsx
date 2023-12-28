import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "15px",
        paddingTop: "10px",
      }}
    >
      <Link to="/">
        <img
          src="easepalLogo.png"
          alt="logo"
          width={"55px"}
          height={"60px"}
          className={"image-inverted"}
        />
      </Link>
      <Link to="/">
        {/* <Typography
            sx={{
              display: { md: "block", sm: "none", xs: "none" },
              fontWeight: "800",
              textShadow: "2px 2px 20px #000",
            }}
          >
            <span style={{ fontSize: '20px' }}>EasePal</span>
          </Typography> */}
      </Link>
    </div>
  );
};

export default Logo;
