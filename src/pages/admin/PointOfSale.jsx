import { useEffect, useMemo, useState } from "react";
import {
  LayoutGrid,
  Coffee,
  Image as ImageIcon,
  Shirt,
  Search,
  Pencil,
  X,
  ReceiptText,
} from "lucide-react";
import { Modal } from "../../components/admin/Modal";
import { api, asNumber, normalizeStatus } from "../../api/client";
import { LoadingScreen } from "../../components/LoadingScreen";

const currency = (n) => `$${asNumber(n).toFixed(2)}`;

const CATEGORY_ICONS = {
  All: LayoutGrid,
  Ceramics: Coffee,
  Prints: ImageIcon,
  Textiles: Shirt,
};

const emptyModalState = {
  product: null,
  qty: 1,
  notes: "",
  editingCartId: null,
};

export const AdminPointOfSale = () => {
  const [products, setProducts] = useState([]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products],
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]); // { cartId, productId, name, price, media, qty, notes }
  const [customerName, setCustomerName] = useState("");
  const [fulfillment, setFulfillment] = useState("Take today");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [modal, setModal] = useState(emptyModalState);
  const [placedOrder, setPlacedOrder] = useState(null); // { code, total }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.admin.products({ status: "ACTIVE" })
      .then(({ products: responseProducts }) =>
        setProducts(responseProducts.map((product) => ({ ...product, status: normalizeStatus(product.status) }))),
      )
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, activeCategory, query]);

  const subtotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const tax = subtotal * 0.1;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal + tax - discount);

  // ---- product modal (add / edit a cart line) --------------------------

  const openProduct = (product) => {
    setModal({ product, qty: 1, notes: "", editingCartId: null });
  };

  const openEdit = (cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    setModal({
      product,
      qty: cartItem.qty,
      notes: cartItem.notes,
      editingCartId: cartItem.cartId,
    });
  };

  const closeModal = () => setModal(emptyModalState);

  const confirmModal = () => {
    const { product, qty, notes, editingCartId } = modal;
    if (!product || qty < 1) return;

    setCart((prev) => {
      if (editingCartId) {
        return prev.map((i) =>
          i.cartId === editingCartId ? { ...i, qty, notes } : i,
        );
      }
      const existing = prev.find(
        (i) => i.productId === product.id && i.notes === notes,
      );
      if (existing) {
        return prev.map((i) =>
          i.cartId === existing.cartId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [
        ...prev,
        {
          cartId: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          media: product.media,
          qty,
          notes,
        },
      ];
    });
    closeModal();
  };

  // ---- cart line actions -----------------------------------------------

  const adjustCartQty = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeCartItem = (cartId) =>
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));

  const applyPromo = () => {
    setPromoApplied(promoCode.trim().toUpperCase() === "STUDIO10");
  };

  // ---- checkout ----------------------------------------------------

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      setError("");
      const { order } = await api.admin.createOrder({
        customerName: customerName.trim() || "Walk-in",
        shipping: fulfillment === "Ship to customer" ? "STANDARD" : "PICKUP",
        payment: "PAID",
        items: cart.map(({ productId, qty, notes }) => ({ productId, qty, notes: notes || undefined })),
      });
      setProducts((prev) => prev.map((product) => {
        const sold = cart.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.qty, 0);
        return sold ? { ...product, stock: Math.max(0, product.stock - sold) } : product;
      }));
      setPlacedOrder({ code: order.code, total: asNumber(order.total) });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const startNewSale = () => {
    setCart([]);
    setCustomerName("");
    setFulfillment("Take today");
    setPromoCode("");
    setPromoApplied(false);
    setPlacedOrder(null);
  };

  if (loading) return <LoadingScreen inline label="Loading point of sale..." />;

  return (
    <div className="pos-shell">
      {error && <p className="admin-page-sub" role="alert">{error}</p>}
      {/* ---- left: menu ---- */}
      <div>
        <div
          className="admin-search-input"
          style={{ maxWidth: "100%", marginBottom: 4 }}
        >
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
          />
        </div>

        <div className="pos-categories">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || LayoutGrid;
            const count =
              cat === "All"
                ? products.length
                : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`pos-category${activeCategory === cat ? " is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="pos-category__icon">
                  <Icon size={17} />
                </span>
                <span className="pos-category__label">{cat}</span>
                <span className="pos-category__count">{count} items</span>
              </button>
            );
          })}
        </div>

        <div className="pos-grid">
          {filteredProducts.map((p) => {
            const inCartQty = cart
              .filter((i) => i.productId === p.id)
              .reduce((sum, i) => sum + i.qty, 0);
            const outOfStock = p.stock <= 0;
            return (
              <button
                key={p.id}
                className="pos-card"
                disabled={outOfStock}
                onClick={() => !outOfStock && openProduct(p)}
              >
                {outOfStock && <span className="pos-card__oos">Sold out</span>}
                {!outOfStock && inCartQty > 0 && (
                  <span className="pos-card__badge">{inCartQty} in cart</span>
                )}
                <div className="pos-card__media">{p.media}</div>
                <p className="pos-card__name">{p.name}</p>
                <div className="pos-card__footer">
                  <span className="pos-card__tag">{p.category}</span>
                  <span className="pos-card__price">
                    {currency(Number(p.price))}
                  </span>
                </div>
              </button>
            );
          })}
          {filteredProducts.length === 0 && (
            <p className="admin-list__empty" style={{ gridColumn: "1 / -1" }}>
              No products match your search.
            </p>
          )}
        </div>
      </div>

      {/* ---- right: cart ---- */}
      <aside className="admin-panel pos-cart">
        <div className="pos-cart__header">
          <p className="pos-cart__title">New Sale</p>
          <p className="pos-cart__subtitle">
            {cart.length} item{cart.length === 1 ? "" : "s"} in cart
          </p>
        </div>

        {!placedOrder && (
          <div className="pos-cart__meta">
            <input
              className="admin-input"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <select
              className="admin-select"
              value={fulfillment}
              onChange={(e) => setFulfillment(e.target.value)}
            >
              <option>Take today</option>
              <option>Ship to customer</option>
            </select>
          </div>
        )}

        {placedOrder ? (
          <div className="pos-success">
            <ReceiptText size={32} color="var(--admin-accent)" />
            <p style={{ marginTop: 12, fontWeight: 600 }}>Order placed</p>
            <p className="pos-success__code">{placedOrder.code}</p>
            <p className="admin-cell-muted" style={{ marginBottom: 18 }}>
              Total charged: {currency(placedOrder.total)}
            </p>
            <button
              className="admin-btn admin-btn--primary pos-place-btn"
              onClick={startNewSale}
            >
              Start new sale
            </button>
          </div>
        ) : (
          <>
            <div className="pos-cart__items">
              {cart.length === 0 && (
                <p className="pos-cart__empty">
                  No items selected yet — tap a product to add it.
                </p>
              )}
              {cart.map((item) => (
                <div key={item.cartId} className="pos-cart-item">
                  <div className="pos-cart-item__media" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="admin-cell-title">{item.name}</p>
                    <p className="admin-cell-sub">{currency(item.price)}</p>
                    {item.notes && (
                      <p className="pos-cart-item__notes">"{item.notes}"</p>
                    )}
                  </div>
                  <div className="pos-cart-item__actions">
                    <div style={{ display: "flex", gap: 2 }}>
                      <button
                        className="admin-icon-btn"
                        onClick={() => openEdit(item)}
                        aria-label="Edit item"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="admin-icon-btn admin-icon-btn--danger"
                        onClick={() => removeCartItem(item.cartId)}
                        aria-label="Remove item"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="admin-stepper">
                      <button onClick={() => adjustCartQty(item.cartId, -1)}>
                        −
                      </button>
                      <span className="admin-stepper__value">{item.qty}</span>
                      <button onClick={() => adjustCartQty(item.cartId, 1)}>
                        +
                      </button>
                    </div>
                    <span className="pos-cart-item__total">
                      {currency(item.qty * item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pos-cart__summary">
              <div className="pos-summary-row">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="pos-summary-row">
                <span>Tax (10%)</span>
                <span>{currency(tax)}</span>
              </div>
              {promoApplied && (
                <div className="pos-summary-row" style={{ color: "#147a41" }}>
                  <span>Discount</span>
                  <span>−{currency(discount)}</span>
                </div>
              )}
              <div className="pos-summary-row pos-summary-row--total">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>

              <div className="pos-promo-row">
                <input
                  className="admin-input"
                  placeholder="Promo code (try STUDIO10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  className="admin-btn admin-btn--outline"
                  onClick={applyPromo}
                >
                  Apply
                </button>
              </div>

              <div className="pos-payment-row">
                {["Cash", "Card"].map((m) => (
                  <button
                    key={m}
                    className={`admin-pill${paymentMethod === m ? " is-active" : ""}`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                className="admin-btn admin-btn--primary pos-place-btn text-white!"
                disabled={cart.length === 0}
                onClick={placeOrder}
              >
                Place Order — {currency(total)}
              </button>
            </div>
          </>
        )}
      </aside>

      {/* ---- product detail modal ---- */}
      <Modal
        open={!!modal.product}
        onClose={closeModal}
        title={modal.editingCartId ? "Edit item" : "Add to order"}
      >
        {modal.product && (
          <div>
            <div className="pos-modal-media">{modal.product.media}</div>
            <p className="admin-cell-title" style={{ fontSize: 15 }}>
              {modal.product.name}
            </p>
            <p className="admin-cell-sub" style={{ marginBottom: 0 }}>
              {modal.product.category}
            </p>
            <p className="pos-modal-price">
              {currency(Number(modal.product.price))}
            </p>

            <textarea
              className="admin-input"
              rows={2}
              placeholder="Add notes to this item (e.g. no sugar, gift-wrapped)…"
              value={modal.notes}
              onChange={(e) =>
                setModal((m) => ({ ...m, notes: e.target.value }))
              }
              style={{ marginBottom: 16, resize: "vertical" }}
            />

            <div className="pos-modal-qty">
              <button
                onClick={() =>
                  setModal((m) => ({ ...m, qty: Math.max(1, m.qty - 1) }))
                }
              >
                −
              </button>
              <span className="pos-modal-qty__value">{modal.qty}</span>
              <button
                onClick={() => setModal((m) => ({ ...m, qty: m.qty + 1 }))}
              >
                +
              </button>
            </div>

            <button
              className="admin-btn admin-btn--primary pos-place-btn"
              onClick={confirmModal}
            >
              {modal.editingCartId ? "Update item" : "Add to cart"} —{" "}
              {currency(Number(modal.product.price) * modal.qty)}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
