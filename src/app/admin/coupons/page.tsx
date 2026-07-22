import { CouponsClient } from "./CouponsClient";

export const dynamic = "force-dynamic";

export default function AdminCouponsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Coupons
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Manage discount codes and promotions
        </p>
      </div>
      <CouponsClient />
    </div>
  );
}
