import './Products.css'
import { useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, addContentListener } from '../utils/storage'
import { getContent, postJson, getJson, setContent } from '../utils/api'
import { FiShoppingCart, FiX } from 'react-icons/fi'

function Products() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState([])
  const [showOrder, setShowOrder] = useState(false)
  const [order, setOrder] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    getContent(STORAGE_KEYS.PRODUCTS, null).then((srv)=>{
      if (Array.isArray(srv)) setItems(srv)
      else setItems([])
    })
  }, [])

  useEffect(() => {
    // Live updates from Admin saves
    const off = addContentListener((key, value) => {
      if (key === STORAGE_KEYS.PRODUCTS) setItems(Array.isArray(value) ? value : [])
    })
    return off
  }, [])

  function getPriceNumber(p) {
    const raw = p && p.price != null ? String(p.price) : '0'
    if (typeof p.price === 'number') return p.price
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''))
    return Number.isFinite(n) ? n : 0
  }

  function getPriceLabel(p) {
    const raw = p && p.price != null ? String(p.price) : ''
    if (/[a-zA-Z₦$€£]/.test(raw)) return raw
    const n = getPriceNumber(p)
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const total = useMemo(() => {
    return selected.reduce((sum, t) => sum + getPriceNumber(t), 0)
  }, [selected])

  function toggle(item) {
    const exists = selected.find((p) => p.title === item.title)
    if (exists) setSelected(selected.filter((p) => p.title !== item.title))
    else setSelected([...selected, item])
  }

  function openOrder() {
    if (selected.length === 0) return
    setShowOrder(true)
  }

  function handlePlaceOrder(e) {
    e.preventDefault()
    // Persist to backend for Admin -> Product Orders only (no WhatsApp redirect)
    const payload = { name: order.name, email: order.email, phone: order.phone, items: selected.map(p=>({ title:p.title, price:getPriceLabel(p) })), total: total.toFixed(2) }
    postJson('/api/products/orders', { values: payload })
      .then(()=>{
        setShowOrder(false)
        setSelected([])
        alert('Order placed')
      })
      .catch(async (err)=>{
        // Fallback for backends without the dedicated endpoint: store under site_content key
        try {
          if (String(err.message || '').includes('404')) {
            const KEY = 'izzy_product_orders'
            let existing = []
            try { existing = await getContent(KEY, []) } catch {}
            const toSave = Array.isArray(existing) ? [...existing, { createdAt: new Date().toISOString(), values: payload }] : [{ createdAt: new Date().toISOString(), values: payload }]
            await setContent(KEY, toSave)
            setShowOrder(false)
            setSelected([])
            alert('Order placed')
            return
          }
        } catch {}
        alert('Failed to place order: ' + err.message)
      })
  }

  return (
    <div className="products">
      <section className="hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(4,22,47,0.6), rgba(4,22,47,0.4)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop')" }}>
        <div className="container hero-inner">
          <h1>Products</h1>
          <p className="sub">Quality digital products ready to deploy.</p>
        </div>
      </section>

      <section className="popular">
        <div className="container">
          <div className="card-grid">
            {items.length > 0 ? items.map((p) => {
              const isPicked = !!selected.find((s) => s.title === p.title)
              const priceLabel = getPriceLabel(p)
              return (
                <article className={`card product ${isPicked ? 'picked' : ''}`} key={p.title}>
                  <div className="media" style={{ backgroundImage: `url(${p.img})` }} />
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p className="muted">{p.copy}</p>
                    <div className="product-meta">
                      <span className="price">{priceLabel}</span>
                      <button className={`cart ${isPicked ? 'active' : ''}`} type="button" onClick={() => toggle(p)} aria-label="Toggle product">
                        <FiShoppingCart />
                      </button>
                    </div>
                  </div>
                </article>
              )
            }) : (
              <p className="muted" style={{gridColumn:'1 / -1', textAlign:'center'}}>No products yet.</p>
            )}
          </div>

          {selected.length > 0 && (
            <div className="order-bar">
              <div className="order-summary">
                <span>{selected.length} selected</span>
                <strong>Total: {total.toFixed(2)}</strong>
              </div>
              <button className="primary" type="button" onClick={openOrder}>Place Order</button>
            </div>
          )}
        </div>
      </section>

      {showOrder && (
        <div className="modal" onClick={() => setShowOrder(false)}>
          <div className="modal-dialog" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-body">
              <div className="modal-head">
                <h3>Place Order</h3>
                <button className="icon" type="button" onClick={()=>setShowOrder(false)} aria-label="Close"><FiX /></button>
              </div>
              <form className="form-grid" onSubmit={handlePlaceOrder}>
                <label>
                  <span>Full Name</span>
                  <input value={order.name} onChange={(e)=>setOrder({...order, name:e.target.value})} required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={order.email} onChange={(e)=>setOrder({...order, email:e.target.value})} required />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" value={order.phone} onChange={(e)=>setOrder({...order, phone:e.target.value})} required />
                </label>
                <label>
                  <span>Total</span>
                  <input value={total.toFixed(2)} readOnly />
                </label>
                <button className="primary" type="submit">Place Now</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
