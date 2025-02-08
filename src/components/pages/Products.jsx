import React, { useState, useEffect } from "react";
import "./Products.css"; // Import CSS for styling

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "Summer Collection", // Default category
    description: "",
    smallQuantity: "",
    mediumQuantity: "",
    largeQuantity: "",
    images: [],
    imageFiles: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/get-all-products-admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setNewProduct({ ...newProduct, imageFiles: [...files] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const uploadImages = async () => {
    const token = localStorage.getItem("token");

    // If no new images are provided, return existing images
    if (newProduct.imageFiles.length === 0) return newProduct.images;

    const formData = new FormData();
    newProduct.imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/upload-files`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.filePaths;
      } else {
        throw new Error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const uploadedImages = await uploadImages();

    const productData = {
      ...newProduct,
      images: uploadedImages.length ? uploadedImages : newProduct.images,
      imageFiles: undefined,
    };

    try {
      const response = await fetch(
        editingProduct
          ? `${import.meta.env.VITE_API_URL}/product/update/${
              editingProduct._id
            }`
          : `${import.meta.env.VITE_API_URL}/product/create-product`,
        {
          method: editingProduct ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        setNewProduct({
          title: "",
          price: "",
          category: "Summer Collection",
          description: "",
          smallQuantity: "",
          mediumQuantity: "",
          largeQuantity: "",
          images: [],
          imageFiles: [],
        });
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      smallQuantity: product.smallQuantity,
      mediumQuantity: product.mediumQuantity,
      largeQuantity: product.largeQuantity,
      images: product.images,
      imageFiles: [],
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/delete/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchProducts();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <button className="add-product-btn" onClick={() => setShowForm(true)}>
        + Add Product
      </button>

      {showForm ? (
        <div className="product-form">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Product Title"
              value={newProduct.title}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleChange}
              required
            />

            {/* Category Dropdown */}
            <select
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              required
            >
              <option value="Summer Collection">Summer Collection</option>
              <option value="Winter Collection">Winter Collection</option>
              <option value="Spring Collection">Spring Collection</option>
              <option value="Fall Collection">Fall Collection</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleChange}
              required
            ></textarea>
            <input
              type="number"
              name="smallQuantity"
              placeholder="Small Size Quantity"
              value={newProduct.smallQuantity}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="mediumQuantity"
              placeholder="Medium Size Quantity"
              value={newProduct.mediumQuantity}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="largeQuantity"
              placeholder="Large Size Quantity"
              value={newProduct.largeQuantity}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
            <button type="submit">
              {editingProduct ? "Update" : "Add"} Product
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <img
                src={product.images[0]}
                alt={product.title}
                className="product-image"
              />
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>Price: Rs {product.price}</p>
                <p>Category: {product.category}</p>
                <p>{product.description}</p>
                <p>
                  Stock: S - {product.smallQuantity}, M -{" "}
                  {product.mediumQuantity}, L - {product.largeQuantity}
                </p>
                <div className="product-actions">
                  <button
                    className="update-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
