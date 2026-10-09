import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/store/ProductCard';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface StorePageProps {
  products: Product[];
}

export const StorePage: React.FC<StorePageProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category.toUpperCase() === selectedCategory;
  });

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShoppingBag size={24} color="var(--bdk-gold)" />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
            Official BDK Merchandise Store
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Authentic match kits, training gear, and Waves of Tana memorabilia. 100% of proceeds support youth academy operations.
        </p>
      </div>

      {/* Perks Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="var(--bdk-gold)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>100% Official Club Gear</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Certified authentic badges</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Truck size={24} color="var(--bdk-accent)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Nationwide Delivery</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Addis Ababa, Bahir Dar & all regions</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <RotateCcw size={24} color="#34d399" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Hassle-Free Exchanges</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>14-day jersey size swaps</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        {['ALL', 'KITS', 'APPAREL', 'ACCESSORIES', 'MEMORABILIA'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: selectedCategory === cat ? '1px solid var(--bdk-gold)' : '1px solid var(--border-color)',
              backgroundColor: selectedCategory === cat ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? 'var(--bdk-gold)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {cat === 'ALL' ? 'All Products' : cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid-responsive-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
