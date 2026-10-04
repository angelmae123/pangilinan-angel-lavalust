import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DisplayProd() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await api.get("/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProducts(response.data);

        } catch (error) {
            console.error("GET PRODUCTS ERROR:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load products."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("access_token");

            await api.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.id !== id
                )
            );

            toast.success("Product deleted successfully!");

        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Failed to delete product."
            );
        }
    };
    const handleLogout = async () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        const refreshToken =
            localStorage.getItem("refresh_token");

        try {
            if (refreshToken) {
                await api.post("/logout", {
                    refresh_token: refreshToken,
                });
            }

            toast.success("Logged out successfully!");

        } catch (error) {
            console.error("LOGOUT ERROR:", error);

        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        }
    };

    if (loading) {
        return (
            <div className="loading-page">
                Loading products...
            </div>
        );
    }

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <h1>Welcome to Products View</h1>
                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <main className="dashboard-main">

                <div className="page-heading">
                    <h2>Product List</h2>

                    <button className="add-btn" onClick={() => navigate("/add")}>+ Add Product</button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="table-card">

                    {products.length === 0 ? (
                        <div className="empty-state">
                            No products found.
                        </div>
                    ) : (
                        <table className="product-table">

                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>

                                        <td>
                                            <div className="product-name">
                                                {product.product_name}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="product-description">
                                                {product.description || "No description"}
                                            </div>
                                        </td>

                                        <td>
                                            <span className="price">₱ {Number(product.price).toFixed(2)}</span>
                                        </td>

                                        <td>
                                            <span className="quantity"> {product.quantity}</span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="edit-btn" onClick={() => navigate(`/edit/${product.id}`)}
                                                >Update
                                                </button>

                                                <button
                                                    className="delete-btn" onClick={() => handleDelete(product.id)}
                                                >Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

export default DisplayProd;
