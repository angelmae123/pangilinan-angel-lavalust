import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/login",
                {
                    username,
                    password,
                }
            );

            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;

            if (!accessToken) {
                throw new Error(
                    "No access token received from API."
                );
            }

            localStorage.setItem("access_token", accessToken);

            if (refreshToken) {
                localStorage.setItem("refresh_token", refreshToken);
            }

            navigate("/products");

        } catch (error) {
            console.error("LOGIN ERROR:", error);

            if (error.response) {
                toast.error(error.response.data?.message || "Invalid username or password.");
            } else {
                toast.error( error.message || "Cannot connect to the API.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1 className="login-title">
                    Login
                </h1>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >
                    <div className="form-group">
                        <label htmlFor="username"> Username </label>
                        <input
                            id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password"> Password </label>
                        <input
                            id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="login-button" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;