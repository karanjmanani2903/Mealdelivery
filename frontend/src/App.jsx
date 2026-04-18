import { useEffect, useState } from "react";

function App() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [plan, setPlan] = useState(null);
  const [page, setPage] = useState("home");

  useEffect(() => {
    fetch("http://localhost:8000/api/meals")
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleMeal = (id) => {
    setSelectedMeals((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const openMeal = (meal) => {
    setSelectedMeal(meal);
    setPage("detail");
  };

  const createPlan = async () => {
    if (selectedMeals.length === 0) {
      alert("Select at least one meal");
      return;
    }

    const res = await fetch("http://localhost:8000/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "karan",
        meals: selectedMeals,
        weekStartDate: new Date(),
      }),
    });

    const data = await res.json();
    setPlan(data);
    setPage("plan");
  };

  const createOrder = async () => {
    const planId = plan?.plan?._id || plan?._id;

    await fetch("http://localhost:8000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "karan",
        planId,
      }),
    });

    setPage("order");
  };

  const isEssential = (name) => {
    const basics = ["salt", "oil", "water", "flour", "sugar"];
    return basics.includes(name.toLowerCase());
  };

  return (
    <div style={{ background: "#f8f9fb", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <div style={{
        background: "#111",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold"
      }}>
        <span>MealAI 🍽️</span>
        <span>Selected: {selectedMeals.length}</span>
      </div>

      {/* HERO */}
      <div style={{
        height: "280px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{
          background: "rgba(0,0,0,0.6)",
          padding: "25px",
          borderRadius: "12px"
        }}>
          <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
            Plan Meals Smarter
          </h1>
          <p style={{ fontSize: "16px" }}>
            Select dishes → Generate plan → Get groceries
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "30px" }}>

        {/* HOME */}
        {page === "home" && (
          <>
            <h2 style={{ marginBottom: "20px" }}>Explore Meals</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px"
            }}>
              {meals.map((meal) => {
                const isSelected = selectedMeals.includes(meal._id);

                return (
                  <div
                    key={meal._id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "15px",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                      transition: "0.2s",
                    }}
                  >
                    <div
                      onClick={() => openMeal(meal)}
                      style={{ cursor: "pointer" }}
                    >
                      <h3>{meal.name}</h3>
                      <p style={{ fontSize: "13px", color: "#666" }}>
                        {meal.description}
                      </p>
                      <p><strong>₹{meal.basePrice}</strong></p>
                    </div>

                    <button
                      onClick={() => toggleMeal(meal._id)}
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        padding: "8px",
                        background: isSelected ? "#dc2626" : "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {isSelected ? "Remove" : "Add to Plan"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={createPlan}
                style={{
                  marginTop: "30px",
                  padding: "14px 30px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Generate Weekly Plan 🚀
              </button>
            </div>
          </>
        )}

        {/* DETAIL */}
        {page === "detail" && selectedMeal && (
          <>
            <button onClick={() => setPage("home")}>⬅ Back</button>

            <h2 style={{ marginTop: "20px" }}>{selectedMeal.name}</h2>
            <p>{selectedMeal.description}</p>
            <p><strong>Category:</strong> {selectedMeal.category}</p>
            <p><strong>Price:</strong> ₹{selectedMeal.basePrice}</p>

            <h3>Ingredients</h3>
            <ul>
              {selectedMeal.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.name} - {ing.quantity}
                </li>
              ))}
            </ul>

            <button
              onClick={() => toggleMeal(selectedMeal._id)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
              }}
            >
              {selectedMeals.includes(selectedMeal._id)
                ? "Remove from Plan"
                : "Add to Plan"}
            </button>
          </>
        )}

        {/* PLAN */}
        {page === "plan" && plan && (
          <>
            <h2>Your Weekly Plan 🍱</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px"
            }}>
              {meals
                .filter((meal) => selectedMeals.includes(meal._id))
                .map((meal) => (
                  <div key={meal._id} style={{
                    background: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}>
                    <h4>{meal.name}</h4>
                    <p>₹{meal.basePrice}</p>
                  </div>
                ))}
            </div>

            <h3 style={{ marginTop: "20px" }}>
              Total Price: ₹{plan.plan?.totalPrice || plan.totalPrice}
            </h3>

            <div style={{ marginTop: "25px" }}>
              <h3>Groceries we will deliver 🛒</h3>

              <ul>
                {Object.entries(plan.ingredients || {})
                  .filter(([name]) => !isEssential(name))
                  .map(([name, value]) => (
                    <li key={name}>
                      {name}: {value.total} {value.unit}
                    </li>
                  ))}
              </ul>
            </div>

            <button onClick={createOrder}>Place Order</button>
            <button onClick={() => setPage("home")}>Back</button>
          </>
        )}

        {/* ORDER */}
        {page === "order" && (
          <>
            <h2>Order Confirmed 🎉</h2>
            <p>Your order has been placed successfully.</p>
            <button onClick={() => setPage("home")}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;