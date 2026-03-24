import React from "react";
import Parse from "parse";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Alert } from "@mui/material";

type Props = { onNavigate: (p: any) => void };

export default function Login({ onNavigate }: Props) {

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values: any, { setSubmitting, setErrors }: any) => {
    try {
      const user = await Parse.User.logIn(values.username, values.password);
      const token = user.getSessionToken();
      if (!token) throw new Error("No session token returned");
      localStorage.setItem("sessionToken", token);
      onNavigate("home");
    } catch (e: any) {
      setErrors({ server: e.message || "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 520, p: 4, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Welcome to Routine Rampage
      </Typography>

      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, errors }: any) => (
          <Box component={Form} sx={{ display: "grid", gap: 2 }}>
            {errors.server && (
              <Alert severity="error">{errors.server}</Alert>
            )}

            <Field
              as={TextField}
              label="Username"
              name="username"
              required
              fullWidth
              error={!!errors.username}
              helperText={errors.username}
            />

            <Field
              as={TextField}
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging In..." : "Login"}
            </Button>

            <Button
              variant="text"
              onClick={() => onNavigate("register")}
            >
              Create account
            </Button>
            <Button
              variant="text"
              onClick={() => onNavigate("forgot")}
            >
              Forgot password
            </Button>
          </Box>
        )}
      </Formik>
    </Paper>
  );
}
