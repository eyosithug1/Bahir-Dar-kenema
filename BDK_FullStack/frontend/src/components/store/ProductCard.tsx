import React, { useState } from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="glass-panel" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid var(--border-color)',
      transition: 'var(--transition)',
      position: 'relative'
    }}>
      <div>
        {/* Product Image */}
        <div style={{ position: 'relative', height: '220px', backgroundColor: '#07151a' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
            {product.isNewArrival && <span className="badge badge-blue">NEW</span>}
            {product.isBestSeller && <span className="badge badge-gold">POPULAR</span>}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--bdk-accent)', fontWeight: 600, textTransform: 'uppercase' }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--bdk-gold)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Star size={13} fill="var(--bdk-gold)" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.5rem' }}>
            {product.name}
          </h3>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem' }}>
            {product.description}
          </p>

          {/* Sizes if available */}
          {product.sizes && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.3rem', fontWeight: 600 }}>
                SELECT SIZE
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedSize === size ? '1px solid var(--bdk-gold)' : '1px solid var(--border-color)',
                      backgroundColor: selectedSize === size ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
                      color: selectedSize === size ? 'var(--bdk-gold)' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--bdk-gold)' }}>
            {product.price} <span style={{ fontSize: '0.8rem' }}>ETB</span>
          </div>
          {product.originalPrice && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
              {product.originalPrice} ETB
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1rem',
            backgroundColor: addedAnimation ? '#10b981' : 'var(--bdk-secondary)',
            color: addedAnimation ? '#fff' : '#091c20',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          {addedAnimation ? <Check size={16} /> : <ShoppingBag size={16} />}
          <span>{addedAnimation ? 'Added!' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
