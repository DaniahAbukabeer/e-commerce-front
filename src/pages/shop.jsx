import { useEffect, useState } from "react";
import { mascot } from "../assets/mascot";
import { api, asNumber } from "../api/client";
import { LoadingScreen } from "../components/LoadingScreen";

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.store.products().then(({ products: responseProducts }) => setProducts(responseProducts)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingScreen label="Loading the shop..." />;
  return (
    <section className="page">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div>
          <span className="eyebrow">fresh off the shelf</span>
          <h1>Shop</h1>
          <p style={{ maxWidth: "56ch", color: "var(--brown-soft)" }}>
            Everything here is made or printed in the studio. New pieces go up
            most Fridays.
          </p>
        </div>
        <img
          src={mascot.painting}
          alt=""
          className="mascot section-mascot"
          style={{ marginTop: 4 }}
        />
      </div>
      {error && <p style={{ color: "var(--brown-soft)" }} role="alert">{error}</p>}

      <div className="card-grid">
        {products.map((p) => (
          <article className="item-card doodle" key={p.name}>
            <div className="item-card__media">{p.media}</div>
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <div className="item-card__footer">
              <span className="tag">${asNumber(p.price)}</span>
              <button
                className="btn btn-outline doodle doodle-tight"
                style={{ padding: "6px 14px", fontSize: "0.82rem" }}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};