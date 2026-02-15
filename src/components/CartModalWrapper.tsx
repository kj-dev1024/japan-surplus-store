'use client';

import { useCart } from '@/contexts/CartContext';
import CartModal from '@/components/CartModal';

export default function CartModalWrapper() {
  const { isCartOpen, closeCart } = useCart();
  return <CartModal isOpen={isCartOpen} onClose={closeCart} />;
}
