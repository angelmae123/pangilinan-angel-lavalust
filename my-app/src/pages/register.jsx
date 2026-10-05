import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!username || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/users", {
                username,
                email,
                password,
            });

            toast.success("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("REGISTER ERROR:", error);

            if (error.response) {
                toast.error(
                    error.response.data?.message ||
                    "Registration failed."
                );
            } else {
                toast.error("Cannot connect to the API.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h1 className="login-title">Register</h1>

                <p className="login-subtitle">
                    Create your account
                </p>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleRegister}
                >

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <p className="register-link">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;