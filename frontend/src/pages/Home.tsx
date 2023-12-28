import { Box } from "@mui/material";
import TypingAnimation from "../components/typer/TypingAnimation";
import Footer from "../components/footer/Footer";

const Home = () => {
  return (
    <Box width={"100"} height={"100%"}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          mt: 3,
        }}
      >
        <Box>
          <TypingAnimation />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { md: "row", xs: "column", sm: "column" },
            gap: 5,
            my: 10,
          }}
        >
          <img
            src="hpRobot.png"
            alt="homepageRobot"
            style={{
              maxWidth: "900px",
              margin: "auto",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Box>
      <Footer></Footer>
    </Box>
  );
};

export default Home;
