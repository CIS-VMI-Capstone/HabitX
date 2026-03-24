import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Alert } from "@mui/material";

export default function Registration() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSignup = async (values: any, { setSubmitting, setErrors }: any) => {
    const user = new (window as any).Parse.User();
    user.set("username", values.username);
    user.set("password", values.password);
    user.set("email", values.email);

    try {
      await user.signUp();
      localStorage.setItem("sessionToken", user.getSessionToken());
      navigate("/home");
    } catch (e: any) {
      setErrors({ server: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 560, p: 4, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Create your account
      </Typography>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
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
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
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

            <Field
              as={TextField}
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <Button variant="text" onClick={() => navigate("/login")}>
              ← Login
            </Button>
          </Box>
        )}
      </Formik>
    </Paper>
  );
}
