const products = [
  {
    name: "Speckled Mug",
    desc: "Wheel-thrown stoneware, oatmeal glaze.",
    price: "$28",
    media: "hand-thrown",
  },
  {
    name: "Sunday Market Print",
    desc: "Two-colour riso print, edition of 50.",
    price: "$18",
    media: "risograph",
  },
  {
    name: "Clay Bud Vase",
    desc: "Small enough for one stem, or three.",
    price: "$22",
    media: "hand-thrown",
  },
  {
    name: "Studio Tote",
    desc: "Screen-printed canvas, holds everything.",
    price: "$24",
    media: "silkscreen",
  },
  {
    name: "Notecard Set",
    desc: "Six linocut cards, blank inside.",
    price: "$14",
    media: "linocut",
  },
  {
    name: "Ceramic Dish",
    desc: "For rings, keys, or a little dish of salt.",
    price: "$19",
    media: "hand-thrown",
  },
];

export const Shop = () => {
  return (
    <section className="page">
      <span className="eyebrow">fresh off the shelf</span>
      <h1>Shop</h1>
      <p style={{ maxWidth: "56ch", color: "var(--brown-soft)" }}>
        Everything here is made or printed in the studio. New pieces go up most
        Fridays.
      </p>

      <div className="card-grid">
        {products.map((p) => (
          <article className="item-card doodle" key={p.name}>
            <div className="item-card__media">{p.media}</div>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <div className="item-card__footer">
              <span className="tag">{p.price}</span>
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
