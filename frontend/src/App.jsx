import { useEffect, useState } from "react";

function App() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [plan, setPlan] = useState(null);
  const [page, setPage] = useState("home");

  // Fetch meals
  useEffect(() => {
    fetch("http://localhost:8000/api/meals")
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((err) => console.error(err));
  }, []);

  // Toggle selection
  const toggleMeal = (id) => {
    setSelectedMeals((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  // Create plan
  const createPlan = async () => {
    if (selectedMeals.length === 0) {
      alert("Please select at least one meal");
      return;
    }

    const res = await fetch("http://localhost:8000/api/plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  // Create order
  const createOrder = async () => {
    const planId = plan?.plan?._id || plan?._id;

    const res = await fetch("http://localhost:8000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: "karan",
        planId,
      }),
    });

    await res.json();
    setPage("order");
  };

  // Smart recommendation (ingredient-based)
  const getRecommendations = () => {
    if (selectedMeals.length === 0) return [];

    const selected = meals.filter((m) =>
      selectedMeals.includes(m._id)
    );

    const selectedIngredients = new Set();

    selected.forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        selectedIngredients.add(ing.name);
      });
    });

    const scored = meals
      .filter((m) => !selectedMeals.includes(m._id))
      .map((meal) => {
        let score = 0;

        meal.ingredients.forEach((ing) => {
          if (selectedIngredients.has(ing.name)) score++;
        });

        return { ...meal, score };
      });

    return scored.sort((a, b) => b.score - a.score).slice(0, 6);
  };

  // Image helper
  const getMealImage = (name) => {
    return `https://source.unsplash.com/300x200/?${name},food`;
  };

  return (
    <div>
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "#111",
          color: "white",
          padding: "15px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Meal Delivery
      </div>

      <div
        style={{
          padding: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HOME */}
        {page === "home" && (
          <>
            <h2>Explore Meals</h2>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {meals.map((meal) => {
                const isSelected = selectedMeals.includes(meal._id);

                return (
                  <div
                    key={meal._id}
                    onClick={() => toggleMeal(meal._id)}
                    style={{
                      border: isSelected
                        ? "2px solid #22c55e"
                        : "1px solid #ddd",
                      width: "260px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      overflow: "hidden",
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img
                      src={getMealImage(meal.name)}
                      alt={meal.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />

                    <div style={{ padding: "12px" }}>
                      <h3>{meal.name}</h3>
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        {meal.description}
                      </p>
                      <p><strong>₹{meal.basePrice}</strong></p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {selectedMeals.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h2>Smart Recommendations 🔥</h2>

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {getRecommendations().map((meal) => (
                    <div
                      key={meal._id}
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        backgroundColor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      <img
                        src={getMealImage(meal.name)}
                        alt={meal.name}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ padding: "10px" }}>
                        <h4>{meal.name}</h4>
                        <p>₹{meal.basePrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={createPlan}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Weekly Plan
            </button>
          </>
        )}

        {/* PLAN */}
        {page === "plan" && plan && (
          <>
            <h2>Plan Summary</h2>

            <ul>
              {Object.entries(plan.ingredients || {}).map(([name, value]) => (
                <li key={name}>
                  {name}: {value.total} {value.unit}
                </li>
              ))}
            </ul>

            <h3>Total Price: ₹{plan.plan?.totalPrice || plan.totalPrice}</h3>

            <button onClick={createOrder}>Place Order</button>

            <button onClick={() => setPage("home")}>
              Back
            </button>
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