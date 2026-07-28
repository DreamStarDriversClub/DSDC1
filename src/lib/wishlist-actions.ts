"use server";

// Wishlist server actions are now handled via the /api/wishlist routes
// and the WishlistProvider context (client-side). This file is retained
// as a stub for any future server-side wishlist operations.

export async function removeFromWishlistAction(_productId: string) {
  // Handled client-side via WishlistContext
}

export async function addToWishlistAction(_productId: string) {
  // Handled client-side via WishlistContext
}
