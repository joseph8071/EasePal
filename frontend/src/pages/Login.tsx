import { Box } from "@mui/material";
import { Typography, Button } from "@mui/material";
import React from "react";
import CustomInput from "../components/shared/CustomInput";
import { AiOutlineLogin } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const auth = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing In...", { id: "login" });
      await auth?.login(email, password);
      toast.success("Signed In Successfully", { id: "login" });
    } catch (error) {
        console.log(error);
        toast.error("Sign in Failed", { id: "login" });
    }
  };
  return (
    <Box width={"100%"} display="flex" flex={1} height={"100%"}>
      <Box padding={8} mt={8} display={{ md: "flex", sm: "none", xs: "none" }}>
        <img src="robot.png" alt="robot" style={{ width: "400px" }} />
      </Box>
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={16}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign={"center"}
              padding={2}
              fontWeight={600}
            >
              Login
            </Typography>
            <CustomInput name="email" label="Email" type="email" />
            <CustomInput name="password" label="Password" type="password" />
            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                width: "400px",
                borderRadius: 2,
                fontSize: 20,
                ":hover": { bgcolor: "white", color: "black" },
                color: "white",
                marginTop: 2,
                bgcolor: "#00fffc",
              }}
              endIcon={<AiOutlineLogin />}
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
