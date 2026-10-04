import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddProd() {
    const navigate = useNavigate();

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                navigate("/login");
                return;
            }

            await axios.post(
                "/api/products",
                {
                    product_name: productName,
                    description: description,
                    price: Number(price),
                    quantity: Number(quantity),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Product added successfully!");
            navigate("/products");

        } catch (error) {
            console.error("ADD PRODUCT ERROR:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to add product."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-container">

                <div className="form-card">

                    <div className="form-header">
                        <div>
                            <h1>Add Product</h1>
                            <p>
                                Add a new product to your inventory.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/products")}
                        >
                            Back
                        </button>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <form
                        className="product-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">
                            <label htmlFor="productName">
                                Product Name
                            </label>

                            <input
                                id="productName"
                                type="text"
                                placeholder="Enter product name"
                                value={productName}
                                onChange={(e) =>
                                    setProductName(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows="4"
                            />
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="price">
                                    Price
                                </label>

                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="quantity">
                                    Quantity
                                </label>

                                <input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => navigate("/products")}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Adding..."
                                    : "Add Product"}
                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default AddProd;