"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { DiscountType } from "@prisma/client";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

/* ── Types ──────────────────────────────────────────────── */

export interface CartItem {
  id: string; // cartItem DB id or local temp id
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  variantName?: string;
  image?: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

export type ShippingMethod = "standard" | "express" | "free";

export interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  couponError: string | null;
  shippingMethod: ShippingMethod;
  isOpen: boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_COUPON"; coupon: AppliedCoupon | null; error?: string | null }
  | { type: "SET_SHIPPING"; method: ShippingMethod }
  | { type: "TOGGLE_CART"; open?: boolean }
  | { type: "SET_LOADING"; loading: boolean };

/* ── Helpers ────────────────────────────────────────────── */

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateDiscount(
  subtotal: number,
  coupon: AppliedCoupon | null,
): number {
  if (!coupon) return 0;
  if (coupon.discountType === "PERCENTAGE") {
    return Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
  }
  return Math.min(coupon.discountValue, subtotal);
}

function calculateShipping(
  subtotal: number,
  method: ShippingMethod,
  coupon: AppliedCoupon | null,
): number {
  // FREESHIP coupon or free shipping method
  if (method === "free") return 0;
  if (coupon?.discountType === "FIXED" && coupon.code === "FREESHIP") return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method === "express" ? 14.99 : 5.99;
}

/* ── Context ─────────────────────────────────────────────── */

interface CartContextValue {
  state: CartState;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon | null, error?: string | null) => void;
  setShipping: (method: ShippingMethod) => void;
  toggleCart: (open?: boolean) => void;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ── Reducer ─────────────────────────────────────────────── */

const STORAGE_KEY = "dsdc-cart";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items };

    case "ADD_ITEM": {
      // Check if item already exists (same product+variant combo)
      const existingIdx = state.items.findIndex(
        (i) =>
          i.productId === action.item.productId &&
          i.variantId === action.item.variantId,
      );
      let newItems: CartItem[];
      if (existingIdx >= 0) {
        newItems = state.items.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item,
        );
      } else {
        const newId =
          "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
        newItems = [...state.items, { ...action.item, id: newId }];
      }
      saveToStorage(newItems);
      return { ...state, items: newItems };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.id);
      saveToStorage(newItems);
      return { ...state, items: newItems };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== action.id);
        saveToStorage(newItems);
        return { ...state, items: newItems };
      }
      const newItems = state.items.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item,
      );
      saveToStorage(newItems);
      return { ...state, items: newItems };
    }

    case "CLEAR_CART":
      saveToStorage([]);
      return {
        ...state,
        items: [],
        coupon: null,
        couponError: null,
        shippingMethod: "standard",
      };

    case "SET_COUPON":
      return {
        ...state,
        coupon: action.coupon,
        couponError: action.error ?? null,
      };

    case "SET_SHIPPING":
      return { ...state, shippingMethod: action.method };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: action.open !== undefined ? action.open : !state.isOpen,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.loading };

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  coupon: null,
  couponError: null,
  shippingMethod: "standard",
  isOpen: false,
  isLoading: false,
};

/* ── Provider ────────────────────────────────────────────── */

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.length > 0) {
      dispatch({ type: "SET_ITEMS", items: stored });
    }
  }, []);

  // Automatically determine shipping method based on subtotal
  const subtotal = calculateSubtotal(state.items);
  const discount = calculateDiscount(subtotal, state.coupon);
  const discountedSubtotal = subtotal - discount;
  const shipping = calculateShipping(
    discountedSubtotal,
    state.shippingMethod,
    state.coupon,
  );
  const taxRate = 0.08; // placeholder flat 8%
  const tax = Math.round(discountedSubtotal * taxRate * 100) / 100;
  const total = Math.max(
    0,
    Math.round((discountedSubtotal + shipping + tax) * 100) / 100,
  );
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const freeShippingRemaining = Math.max(
    0,
    Math.round((FREE_SHIPPING_THRESHOLD - discountedSubtotal) * 100) / 100,
  );
  const isFreeShipping = freeShippingRemaining === 0;

  const addToCart = useCallback(
    (item: Omit<CartItem, "id">) => {
      dispatch({ type: "ADD_ITEM", item: item as CartItem });
    },
    [],
  );

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const applyCoupon = useCallback(
    (coupon: AppliedCoupon | null, error?: string | null) => {
      dispatch({ type: "SET_COUPON", coupon, error });
    },
    [],
  );

  const setShipping = useCallback((method: ShippingMethod) => {
    dispatch({ type: "SET_SHIPPING", method });
  }, []);

  const toggleCart = useCallback((open?: boolean) => {
    dispatch({ type: "TOGGLE_CART", open });
  }, []);

  const value: CartContextValue = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    setShipping,
    toggleCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
    freeShippingRemaining,
    isFreeShipping,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ── Hook ────────────────────────────────────────────────── */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
