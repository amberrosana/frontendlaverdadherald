import { useState } from "react";
import axios from "axios";
import { Modal, TextInput, PasswordInput, Button, Group, Stack } from "@mantine/core";

export default function LoginPage() {
  const [opened, setOpened] = useState(true); // modal opens by default
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // loading state for login button

  // Sanctum requires cookies to be sent with every request
  axios.defaults.withCredentials = true;

  // Your backend API URL on Render
  const api = "https://final-laverdad-helard.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔵 STEP 1 — Required by Sanctum:
      // This sets the XSRF-TOKEN cookie from Laravel
      await axios.get(`${api}/sanctum/csrf-cookie`);

      // 🔵 STEP 2 — Perform actual login request
      // This stores the session cookie (laravel_session)
      const response = await axios.post(`${api}/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log("Logged in successfully:", response.data);

      // Close login modal on success
      setOpened(false);

    } catch (error) {
      // Shows backend validation or login errors
      console.error("Login failed:", error.response?.data || error);
      alert("Login failed — please check your email or password.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* You can trigger the modal manually if you want */}
      {/* <Button onClick={() => setOpened(true)}>Open Login</Button> */}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Login"
        centered
        size="sm"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" color="blue" loading={loading}>
                Login
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
