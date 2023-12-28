import { Avatar, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}
// @ts-ignore
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
    const firstLine = secondSnippet.split("\n")[0]; // Get the first line of the code snippet
   // @ts-ignore
    const languageName = firstLine.trim().split(" ")[0]; // Extract the first word
  }// @ts-ignore
  const auth = useAuth();
  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 3,
        bgcolor: "#111b27 ",
        my: 2,
        gap: 0,
        borderRadius: 5,
        maxWidth: "100%",
        overflow: "hidden",
        overflowX: "hidden",
        overflowY: "hidden",
        scrollBehavior: "smooth",
      }}
    >
      <Avatar sx={{ ml: "0", width: "70px", height: "70px" }}>
        <img
          src="robotAvatar.png"
          alt="robotAvatar"
          width="70px"
          height="70px"
        />
      </Avatar>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <SyntaxHighlighter
          style={coldarkDark}
          language={languageName}
          wrapLongLines
        >
          {content}
        </SyntaxHighlighter>
        {/* {!messageBlocks && (
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
          )} */}
      </Box>
    </Box>
  ) : (
    // <Box sx={{ display: "flex", p: 2, bgcolor: "#1C2833", gap: 2, my: 2, borderRadius:3}}>
    //   <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
    //     {auth?.user?.name[0].toUpperCase()}
    //   </Avatar>
    //   <Box>
    //     {!messageBlocks && (
    //       <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
    //     )}
    //     {messageBlocks &&
    //       messageBlocks.length &&
    //       messageBlocks.map((block) =>
    //         isCodeBlock(block) ? (
    //           <SyntaxHighlighter style={coldarkDark} language={languageName}>
    //             {block}
    //           </SyntaxHighlighter>
    //         ) : (
    //           <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
    //         )
    //       )}
    //   </Box>
    // </Box>
    <></>
  );
};

export default ChatItem;
