import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [menuItem, setMenuItem] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem("token");
      try {
        const fetchMenuResponse = await axios.get(
          "http://localhost:5000/api/menuItem",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMenuItem(fetchMenuResponse.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };
    fetchMenu();
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart,
          totalPrice: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Order placed:", res.data);
      setCart([]);
      navigate("/orders");
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleCartItem = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i._id === item._id);
      if (existing) {
        return prevCart;
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  return (
    <>
      <h2>Menu</h2>
      <button onClick={() => navigate("/ai")}>AI Food Assistant</button>
      {menuItem.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>Rs {item.price}</p>
          <p>{item.category}</p>
          <button onClick={() => handleCartItem(item)}>Add to Cart</button>
          <hr />
        </div>
      ))}

      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item) => (
          <div key={item._id}>
            <button onClick={() => decreaseQuantity(item._id)}>-</button>
            <span> {item.quantity} </span>
            <button onClick={() => increaseQuantity(item._id)}>+</button>
            <p>{item.name}</p>
            <p>₹{item.price * item.quantity}</p>
          </div>
        ))
      )}
      <h3>Total: ₹{totalPrice}</h3>
      <button onClick={handleOrder} disabled={cart.length === 0}>
        Place Order
      </button>
    </>
  );
}

export default Menu;
