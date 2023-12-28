import { Box } from "@mui/material";

//@ts-ignore
const FormContainer = ({ children }) => {
  return (
    <Box
      sx={{
        bgcolor: "#36567c", // Background color
        borderRadius: 2, // Rounded corners
        p: 3, // Padding around the form
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Box shadow for depth
        mb: 10, // Margin top and bottom
        width: "auto", // Auto width based on content
        mx: 5, // Centering horizontally
      }}
    >
      {children}
    </Box>
  );
};

export default FormContainer;
