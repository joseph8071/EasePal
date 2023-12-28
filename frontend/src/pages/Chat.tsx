import { Avatar, Box, Button, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import red from "@mui/material/colors/red";
import ChatItem from "../components/chat/ChatItem";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
  
} from "../helpers/api-communicator";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import StepForm from "../components/chat/StepForm";
import FormContainer from "../components/chat/FormContainer";
import CircularProgress from "@mui/material/CircularProgress";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900); // Example threshold
  // @ts-ignore
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
    setShowForm(false);
    //
  };
// @ts-ignore
  const handleFormSubmit = async (finalString) => {
    // Handle the final string from the form
    // For example, send it using sendChatRequest
    setLoadingMessage("Crafting your personalized schedule... Stay tuned!");
    setIsLoading(true); // Start loading
    try {
      const chatData = await sendChatRequest(finalString);
      setChatMessages([...chatData.chats]);
      setShowForm(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message", { id: "sendmessage" });
    }
    setIsLoading(false); // Stop loading
  };
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      setShowForm(true);
      toast.success("Successfully deleted chats", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chats", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to load chats", { id: "loadchats" });
        });
    }
  }, [auth]);
  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 900px)").matches);
    };

    checkMobile(); // Check on initial render

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.5,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "95%",
            height: "90vh",
            bgcolor: "#111b27",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0].toUpperCase()}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "Kanit", p: 3, mb: 5 }}>
            <span style={{ fontWeight: 700, fontSize: "35px" }}>
              Welcome to EasePal!
            </span>
          </Typography>
          <Typography
            sx={{ mx: "auto", fontFamily: "Kanit", p: 3, fontSize: "23px" }}
          >
            To create a personalized exercise and stretching routine just for
            you, we need some details. <br />
            <br /> Please answer the following questions as accurately as
            possible.
          </Typography>
          {isLoading ? (
            // Show loading spinner when form is submitting
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
              }}
            >
              <CircularProgress sx={{ mx: "5px" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {loadingMessage}
              </Typography>
            </Box>
          ) : (
            chatMessages.length === 0 &&
            showForm && (
              <FormContainer>
                <StepForm onFormSubmit={handleFormSubmit} />
              </FormContainer>
            )
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: "none", sm: "none" },
          flexDirection: "column",
          px: 0,
          width: "100%",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "40px",
            color: "black",
            mx: "auto",
            fontWeight: 700,
            fontFamily: "Kanit",
          }}
        >
          Personalized Mobility Coach
        </Typography>
        <Box
          sx={{
            width: "auto",
            // height: "85vh",
            borderRadius: 3,
            mx: "10px",
            my: "3px",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            // @ts-ignore
            <ChatItem
              content={chat.content}
              role={chat.role}
              key={index}
              // @ts-ignore
              overflow={"hidden"}
              scrollBehavior={"smooth"}
            />
          ))}
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              alignContent: "flex-end",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              mb: 2,
              bgcolor: red[300],
              ":hover": { bgcolor: red.A400 },
            }}
          >
            Clear Conversation
          </Button>
          {isMobile && (
            <>
              {isLoading ? (
                // Show loading spinner when form is submitting
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "90vh",
                  }}
                >
                  <CircularProgress sx={{ mx: "5px" }} />
                  <Typography variant="h6" sx={{ mt: 2, color: "black" }}>
                    {loadingMessage}
                  </Typography>
                </Box>
              ) : (
                chatMessages.length === 0 &&
                showForm && (
                  <FormContainer>
                    <StepForm onFormSubmit={handleFormSubmit} />
                  </FormContainer>
                )
              )}
            </>
          )}
        </Box>
        {/* <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{ ml: "auto", color: "white", mx: 1 }}
          >
            <Button
              sx={{
                width: "200px",
                my: "auto",
                color: "white",
                fontWeight: "700",
                borderRadius: 3,
                mx: "auto",
                bgcolor: blue[800],
                ":hover": { bgcolor: blue[600] },
              }}
            >
              Create My Routine -  <IoMdSend></IoMdSend>
            
            </Button>
          </IconButton>
        </div> */}
      </Box>
    </Box>
  );
};
export default Chat;
