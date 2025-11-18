import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import { ShoppingCart, Filter, BadgeDollarSign, Phone, Mail, House, Info, MessageCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

// Simple store: products fetched from backend. Editable later via API or code seeding.
async function fetchJSON(url, opts) {
  const res = await fetch(url, opts)
  if (!res.ok) throw new Error('Network error')
  return await res.json()
}

function Layout({ children }){
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setMenuOpen(false), [location.pathname])
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200/60">
        <div className="container-px py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">S</span>
            <span>SwiftShop</span>
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-sky-600">Home</Link>
            <Link to="/shop" className="hover:text-sky-600">Shop</Link>
            <Link to="/about" className="hover:text-sky-600">About</Link>
            <Link to="/contact" className="hover:text-sky-600">Contact</Link>
          </nav>
          <button onClick={()=>setMenuOpen(v=>!v)} className="md:hidden ml-auto btn btn-outline px-3 py-2">Menu</button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200/70 bg-white">
            <div className="container-px py-3 grid gap-2">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200/60 bg-white">
        <div className="container-px py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-extrabold text-lg">SwiftShop</div>
            <p className="mt-2 text-slate-600">123 Business Street, City, State, 000000</p>
            <div className="mt-3 badge">COD Available</div>
          </div>
          <div>
            <div className="font-semibold mb-3">Quick Links</div>
            <div className="grid gap-2">
              <Link to="/" className="hover:text-sky-600">Home</Link>
              <Link to="/shop" className="hover:text-sky-600">Shop</Link>
              <Link to="/about" className="hover:text-sky-600">About</Link>
              <Link to="/contact" className="hover:text-sky-600">Contact</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3">Contact</div>
            <div className="grid gap-1 text-slate-700">
              <div className="inline-flex items-center gap-2"><Phone size={16}/> +91 90000 00000</div>
              <div className="inline-flex items-center gap-2"><Mail size={16}/> hello@youremail.com</div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3">Follow Us</div>
            <div className="flex gap-3 text-slate-700">
              <a href="#" aria-label="WhatsApp" className="hover:text-sky-600">WhatsApp</a>
              <a href="#" className="hover:text-sky-600">Instagram</a>
              <a href="#" className="hover:text-sky-600">Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 py-4">© {new Date().getFullYear()} SwiftShop. All rights reserved.</div>
      </footer>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative h-[520px] sm:h-[560px] lg:h-[620px]">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white pointer-events-none" />
      <div className="relative container-px h-full flex items-center">
        <div className="max-w-xl">
          <div className="badge mb-4 inline-flex"><BadgeDollarSign size={16}/> Cash on Delivery</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Modern Products, Fast Delivery, Pay at Your Doorstep</h1>
          <p className="mt-4 text-slate-600">Discover curated essentials with secure COD. High quality, great prices.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/shop" className="btn btn-primary px-5 py-3"><ShoppingCart size={18}/> Shop Now</Link>
            <a href="#offers" className="btn btn-outline px-5 py-3">Today’s Offers</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function useProducts(category) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  useEffect(() => {
    let mounted = true
    setLoading(true)
    const url = category ? `${API_BASE}/products?category=${encodeURIComponent(category)}` : `${API_BASE}/products`
    fetchJSON(url).then(d => mounted && setProducts(d)).finally(()=> mounted && setLoading(false))
    return () => { mounted = false }
  }, [category])
  return { loading, products }
}

function ProductCard({ p }){
  const navigate = useNavigate()
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="aspect-square bg-slate-50">
        <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'} alt={p.title} className="h-full w-full object-cover"/>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-sm text-slate-500">{p.category}</div>
        <div className="font-semibold text-slate-900 line-clamp-2">{p.title}</div>
        <div className="mt-1 text-sm text-slate-600 line-clamp-2">{p.description}</div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="font-bold">₹{p.price}</div>
          <button onClick={()=>navigate(`/product/${p.id || ''}`, { state: { p } })} className="btn btn-primary px-3 py-2 text-sm">Order Now (COD)</button>
        </div>
      </div>
    </div>
  )
}

function HomePage(){
  const { products } = useProducts()
  const featured = products.slice(0, 8)
  return (
    <>
      <Hero/>
      <section className="container-px py-12" id="categories">
        <h2 className="text-xl font-bold mb-4">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Electronics","Fashion","Home","Beauty","Sports","Accessories"].map(c=> (
            <div key={c} className="card p-4 text-center hover:bg-sky-50">{c}</div>
          ))}
        </div>
      </section>
      <section className="container-px py-12" id="featured">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured</h2>
          <Link to="/shop" className="text-sky-700 hover:underline">View all</Link>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} p={p}/>) }
        </div>
      </section>
      <section className="container-px py-12" id="offers">
        <div className="card p-8 bg-gradient-to-r from-sky-50 to-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold">Today’s Offers</h3>
              <p className="text-slate-600 mt-2">Save more with limited-time deals. COD available on all orders.</p>
            </div>
            <Link to="/shop" className="btn btn-primary px-5 py-3">Grab Deals</Link>
          </div>
        </div>
      </section>
    </>
  )
}

function ShopPage(){
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const { loading, products } = useProducts(category)
  const sorted = useMemo(()=>{
    let arr = [...products]
    if (sort === 'price-asc') arr.sort((a,b)=>a.price-b.price)
    if (sort === 'price-desc') arr.sort((a,b)=>b.price-a.price)
    return arr
  },[products, sort])
  return (
    <section className="container-px py-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-2xl font-extrabold">Shop</h1>
        <div className="flex items-center gap-3">
          <select value={category} onChange={e=>setCategory(e.target.value)} className="input max-w-[200px]">
            <option value="">All Categories</option>
            {["Electronics","Fashion","Home","Beauty","Sports","Accessories"].map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="input max-w-[200px]">
            <option value="">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map(p=> <ProductCard key={p.id} p={p}/>) }
      </div>
      {(!loading && sorted.length===0) && (
        <div className="text-center text-slate-500 py-20">No products found.</div>
      )}
    </section>
  )
}

function CODForm({ product, onClose }){
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', mobile: '', address: '', city: '', state: '', pincode: '', quantity: 1, email: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = { ...form, product_id: product.id || '', product_title: product.title }
      const res = await fetchJSON(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      navigate('/order-confirmation', { state: { order: { ...payload, id: res.id, price: product.price } } })
    } catch(err){
      setError('Could not submit order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="card w-full sm:max-w-lg bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-bold">Order Now – Cash on Delivery</div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <form onSubmit={submit} className="p-4 grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Full Name</div>
              <input className="input" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required />
            </div>
            <div>
              <div className="label">Mobile Number</div>
              <input className="input" value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})} required />
            </div>
          </div>
          <div>
            <div className="label">Full Address</div>
            <textarea className="input" rows={3} value={form.address} onChange={e=>setForm({...form, address:e.target.value})} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">City</div>
              <input className="input" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required />
            </div>
            <div>
              <div className="label">State</div>
              <input className="input" value={form.state} onChange={e=>setForm({...form, state:e.target.value})} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Pincode</div>
              <input className="input" value={form.pincode} onChange={e=>setForm({...form, pincode:e.target.value})} required />
            </div>
            <div>
              <div className="label">Quantity</div>
              <input type="number" min={1} className="input" value={form.quantity} onChange={e=>setForm({...form, quantity:Number(e.target.value)})} required />
            </div>
          </div>
          <div>
            <div className="label">Email (optional)</div>
            <input type="email" className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={submitting} className="btn btn-primary px-5 py-3">
            {submitting ? 'Placing Order...' : 'Confirm Order (COD)'}
          </button>
        </form>
      </div>
    </div>
  )
}

function ProductDetail(){
  const navigate = useNavigate()
  const { state } = useLocation()
  const [product, setProduct] = useState(state?.p || null)
  const [open, setOpen] = useState(false)
  const productId = (state?.p?.id) || window.location.pathname.split('/').pop()

  useEffect(()=>{
    if (!product && productId) {
      fetchJSON(`${API_BASE}/products/${productId}`).then(setProduct).catch(()=>{})
    }
  }, [productId])

  if (!product) return <section className="container-px py-12">Loading...</section>
  return (
    <section className="container-px py-10 grid lg:grid-cols-2 gap-8">
      <div className="card overflow-hidden">
        <div className="aspect-square bg-slate-50">
          <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'} alt={product.title} className="h-full w-full object-cover"/>
        </div>
        {product.images?.length > 1 && (
          <div className="p-3 grid grid-cols-4 gap-3">
            {product.images.slice(1,5).map((img, i)=> (
              <img key={i} src={img} alt="thumb" className="h-20 w-full object-cover rounded-lg"/>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="badge mb-3">Cash on Delivery</div>
        <h1 className="text-2xl font-extrabold">{product.title}</h1>
        <p className="mt-2 text-slate-600">{product.description}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="text-3xl font-extrabold">₹{product.price}</div>
          {product.discount_percent ? (
            <div className="text-emerald-600 font-semibold">Save {product.discount_percent}%</div>
          ) : null}
        </div>
        {product.features?.length ? (
          <div className="mt-6">
            <div className="font-semibold">Features</div>
            <ul className="list-disc pl-6 text-slate-700 mt-2 space-y-1">
              {product.features.map((f,i)=> <li key={i}>{f}</li>)}
            </ul>
          </div>
        ) : null}
        {product.benefits?.length ? (
          <div className="mt-6">
            <div className="font-semibold">Benefits</div>
            <ul className="list-disc pl-6 text-slate-700 mt-2 space-y-1">
              {product.benefits.map((f,i)=> <li key={i}>{f}</li>)}
            </ul>
          </div>
        ) : null}
        {product.specifications?.length ? (
          <div className="mt-6">
            <div className="font-semibold">Specifications</div>
            <ul className="list-disc pl-6 text-slate-700 mt-2 space-y-1">
              {product.specifications.map((f,i)=> <li key={i}>{f}</li>)}
            </ul>
          </div>
        ) : null}
        <div className="mt-8 flex gap-3">
          <button onClick={()=>setOpen(true)} className="btn btn-primary px-5 py-3">Order Now – Cash on Delivery</button>
          <button onClick={()=>navigate('/shop')} className="btn btn-outline px-5 py-3">Back to Shop</button>
        </div>
      </div>
      {open && <CODForm product={product} onClose={()=>setOpen(false)} />}
    </section>
  )
}

function OrderConfirmation(){
  const { state } = useLocation()
  const order = state?.order
  return (
    <section className="container-px py-16 text-center">
      <div className="card mx-auto max-w-xl p-8">
        <div className="text-2xl font-extrabold">Your COD Order is Confirmed</div>
        <p className="mt-2 text-slate-600">We’ll contact you soon for delivery. Below is your summary.</p>
        {order && (
          <div className="mt-6 text-left text-sm grid gap-2">
            <div><span className="font-semibold">Product:</span> {order.product_title}</div>
            <div><span className="font-semibold">Quantity:</span> {order.quantity}</div>
            <div><span className="font-semibold">Price:</span> ₹{order.price}</div>
            <div><span className="font-semibold">Name:</span> {order.full_name}</div>
            <div><span className="font-semibold">Mobile:</span> {order.mobile}</div>
            <div><span className="font-semibold">Address:</span> {order.address}, {order.city}, {order.state} - {order.pincode}</div>
          </div>
        )}
        <Link to="/" className="btn btn-primary px-5 py-3 mt-6 inline-block">Continue Shopping</Link>
      </div>
    </section>
  )
}

function AboutPage(){
  return (
    <section className="container-px py-12">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-extrabold">About Us</h1>
        <p className="mt-4 text-slate-700">Write about your business, vision, and goals here. This section is fully editable in the code. Share your mission, the quality standards you follow, and what sets you apart.</p>
      </div>
    </section>
  )
}

function ContactPage(){
  return (
    <section className="container-px py-12 grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-extrabold">Contact Us</h1>
        <p className="mt-2 text-slate-700">Have questions? Send us a message.</p>
        <form className="mt-6 grid gap-3 max-w-lg">
          <div>
            <div className="label">Your Name</div>
            <input className="input" placeholder="John Doe"/>
          </div>
          <div>
            <div className="label">Email</div>
            <input type="email" className="input" placeholder="you@example.com"/>
          </div>
          <div>
            <div className="label">Message</div>
            <textarea rows={4} className="input" placeholder="How can we help?"/>
          </div>
          <button className="btn btn-primary px-5 py-3">Send</button>
        </form>
      </div>
      <div className="card p-6 h-max">
        <div className="font-semibold">Reach us directly</div>
        <div className="mt-3 text-slate-700 grid gap-2">
          <div className="inline-flex items-center gap-2"><Phone size={16}/> +91 90000 00000</div>
          <div className="inline-flex items-center gap-2"><Mail size={16}/> hello@youremail.com</div>
          <a target="_blank" href="https://wa.me/919000000000" className="btn btn-outline px-4 py-2 inline-flex w-max mt-2"><MessageCircle size={16}/> WhatsApp</a>
        </div>
      </div>
    </section>
  )
}

function NotFound(){
  return (
    <section className="container-px py-20 text-center">
      <div className="text-2xl font-extrabold">Page not found</div>
      <Link to="/" className="text-sky-700 hover:underline inline-block mt-2">Go Home</Link>
    </section>
  )
}

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/shop" element={<ShopPage/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/order-confirmation" element={<OrderConfirmation/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Layout>
  )
}
