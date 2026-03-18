import {
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";

/* ---------------- LOGIN PAGE ---------------- */
function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#59738e", 
      }}
    >
      <Card
        sx={{
          width: 380,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, color: "#1e293b" }}
          >
            Login
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#64748b", mb: 2 }}
          >
            Please sign in to continue
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#1976d2",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
