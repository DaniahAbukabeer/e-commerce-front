import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { Modal } from "../../components/admin/Modal";
import { Field } from "../../components/admin/Field";
import { products as initialProducts, categories } from "../../data/products";

const currency = (n) => `$${n.toLocaleString()}`;

const stockLevel = (p) => {
  if (p.stock === 0) return "out_of_stock";
  if (p.stock <= p.lowStockThreshold) return "low_stock";
  return "in_stock";
};

const emptyDraft = {
  name: "",
  sku: "",
  category: categories[0],
  price: "",
  stock: "",
};

export const AdminStock = () => {
  // Local state seeded from the static data file — swap this for a real
  // `GET /api/products` fetch + mutation calls when the API is ready.
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  const updateStock = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
      ),
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    setProducts((prev) => [
      {
        id: `prod_${Date.now()}`,
        sku: draft.sku || "AA-NEW",
        name: draft.name,
        category: draft.category,
        price: Number(draft.price) || 0,
        stock: Number(draft.stock) || 0,
        lowStockThreshold: 10,
        status: "draft",
        media: "new item",
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setDraft(emptyDraft);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-input">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product or SKU…"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="admin-btn admin-btn--primary text-white!"
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      <div className="admin-pillbar">
        {["all", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`admin-pill${category === c ? " is-active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="admin-hide-sm">Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="admin-hide-md">Availability</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="admin-cell-title">{p.name}</p>
                    <p className="admin-cell-sub">{p.sku}</p>
                  </td>
                  <td className="admin-hide-sm admin-cell-muted">
                    {p.category}
                  </td>
                  <td>{currency(p.price)}</td>
                  <td>
                    <div className="admin-stepper">
                      <button onClick={() => updateStock(p.id, -1)}>−</button>
                      <span className="admin-stepper__value">{p.stock}</span>
                      <button onClick={() => updateStock(p.id, 1)}>+</button>
                    </div>
                  </td>
                  <td className="admin-hide-md">
                    <StatusBadge status={stockLevel(p)} />
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <button className="admin-icon-btn" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="admin-icon-btn admin-icon-btn--danger"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={6}>No products match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add product"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="admin-btn admin-btn--outline"
            >
              Cancel
            </button>
            <button
              onClick={addProduct}
              className="admin-btn admin-btn--primary text-white!"
            >
              Add product
            </button>
          </>
        }
      >
        <form onSubmit={addProduct}>
          <Field label="Product name">
            <input
              className="admin-input"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Glazed Espresso Cup"
              required
            />
          </Field>
          <Field label="SKU">
            <input
              className="admin-input"
              value={draft.sku}
              onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
              placeholder="AA-CUP-08"
            />
          </Field>
          <div className="admin-field-row">
            <Field label="Category">
              <select
                className="admin-select"
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (USD)">
              <input
                type="number"
                min="0"
                className="admin-input"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="24"
              />
            </Field>
          </div>
          <Field label="Starting stock">
            <input
              type="number"
              min="0"
              className="admin-input"
              value={draft.stock}
              onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
              placeholder="20"
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
};
