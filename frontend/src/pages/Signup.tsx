import { Box } from "@mui/material";
import { Typography, Button } from "@mui/material";
import React, { useEffect } from "react";
import CustomInput from "../components/shared/CustomInput";
import { AiOutlineLogin } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing Up...", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Signed Up Successfully", { id: "signup" });
    } catch (error) {
      console.log(error);
      toast.error("Signup Failed", { id: "signup" });
    }
  };
  useEffect(() => {
    if (auth?.user) {
      return navigate("/chat");
    }
  }, [auth]);
  return (
    <Box width={"100%"} display="flex" flex={1} height={"100%"}>
      <Box padding={8} mt={8} display={{ md: "flex", sm: "1", xs: "none" }}>
        <img
          src="robot.png"
          alt="robot"
          style={{
            maxWidth: "1200px",
            margin: "auto",
            width: "100%",
            height: "auto%",
          }}
        />
      </Box>
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5, sm: 1 }}
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
            backgroundColor: "#464646",
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
              Signup
            </Typography>
            <CustomInput name="text" label="Name" type="name" />
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
                ":hover": { bgcolor: "#D3E7FA", color: "#223D66" },
                color: "white",
                marginTop: 2,
                bgcolor: "#1E70DD",
              }}
              endIcon={<AiOutlineLogin />}
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
