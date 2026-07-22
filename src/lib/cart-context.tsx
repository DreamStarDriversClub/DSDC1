"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_RATES, TAX_RATE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────── */

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variantName?: string;
}

interface CouponInfo {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
}

interface CartState {
  items: CartItem[];
  coupon: CouponInfo | null;
  couponError: string | null;
  shippingMethod: "standard" | "express" | "free";
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "APPLY_COUPON"; coupon: CouponInfo | null; error: string | null }
  | { type: "SET_SHIPPING"; method: "standard" | "express" | "free" }
  | { type: "CLEAR_CART" };

/* ── Helpers ─────────────────────────────────────────────── */

function loadCart(): CartState {
  if (typeof window === "undefined") return initialCartState;
  try {
    const stored = localStorage.getItem("dsdc_cart");
    if (stored) return JSON.parse(stored);
  } catch {}
  return initialCartState;
}

function saveCart(state: CartState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("dsdc_cart", JSON.stringify(state));
  } catch {}
}

const initialCartState: CartState = {
  items: [],
  coupon: null,
  couponError: null,
  shippingMethod: "standard",
};

/* ── Reducer ─────────────────────────────────────────────── */

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIdx = state.items.findIndex(
        (i) =>
          i.productId === action.item.productId &&
          i.variantId === action.item.variantId
      );
      let newItems: CartItem[];
      if (existingIdx >= 0) {
        newItems = [...state.items];
        newItems[existingIdx] = {
          ...newItems[existingIdx],
          quantity: newItems[existingIdx].quantity + action.item.quantity,
        };
      } else {
        newItems = [...state.items, action.item];
      }
      return { ...state, items: newItems };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.coupon,
        couponError: action.error,
      };
    case "SET_SHIPPING":
      return { ...state, shippingMethod: action.method };
    case "CLEAR_CART":
      return { ...initialCartState };
    default:
      return state;
  }
}

/* ── Context ─────────────────────────────────────────────── */

interface CartContextValue {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (coupon: CouponInfo | null, error: string | null) => void;
  setShipping: (method: "standard" | "express" | "free") => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadCart);

  // Persist cart to localStorage on changes
  useMemo(() => {
    saveCart(state);
  }, [state]);

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", item }),
    []
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "REMOVE_ITEM", id }),
    []
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", id, quantity }),
    []
  );
  const applyCoupon = useCallback(
    (coupon: CouponInfo | null, error: string | null) =>
      dispatch({ type: "APPLY_COUPON", coupon, error }),
    []
  );
  const setShipping = useCallback(
    (method: "standard" | "express" | "free") =>
      dispatch({ type: "SET_SHIPPING", method }),
    []
  );
  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  );

  // Derived values
  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const discount = useMemo(() => {
    if (!state.coupon) return 0;
    if (state.coupon.discountType === "FIXED") {
      return state.coupon.discountValue;
    }
    return subtotal * (state.coupon.discountValue / 100);
  }, [state.coupon, subtotal]);

  const shipping = useMemo(() => {
    if (state.shippingMethod === "free") return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_RATES[state.shippingMethod].price;
  }, [state.shippingMethod, subtotal]);

  const tax = useMemo(() => {
    return parseFloat(((subtotal - discount) * TAX_RATE).toFixed(2));
  }, [subtotal, discount]);

  const total = useMemo(() => {
    return parseFloat((subtotal - discount + shipping + tax).toFixed(2));
  }, [subtotal, discount, shipping, tax]);

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      setShipping,
      clearCart,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount,
    }),
    [
      state,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      setShipping,
      clearCart,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
