import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}
function isCodeBlock(str: string) {
  if (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  ) {
    return true;
  }
  return false;
}


const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  let languageName = "javascript";
  if (messageBlocks) {
    const secondSnippet = messageBlocks[1];
    const firstLine = secondSnippet.split('\n')[0]; // Get the first line of the code snippet
    const languageName = firstLine.trim().split(' ')[0]; // Extract the first word
  }
  const auth = useAuth();
  return role === "assistant" ? (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#566573 ", my: 2, gap: 2, borderRadius:3 }}>
      <Avatar sx={{ ml: "0" }}>
        <img src="robotAvatar.png" alt="robotAvatar" width="40px" />
      </Avatar>
      <Box>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language={languageName}>
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#1C2833", gap: 2, my: 2, borderRadius:3}}>
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name[0].toUpperCase()}
      </Avatar>
      <Box>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language={languageName}>
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
            )
          )}
      </Box>
    </Box>
  );
};

export default ChatItem;
