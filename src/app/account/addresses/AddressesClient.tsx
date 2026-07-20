"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import {
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
  type AddressFormResult,
} from "@/lib/address-actions";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type Address = {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

function AddressForm({
  mode,
  address,
  onClose,
}: {
  mode: "add" | "edit";
  address?: Address;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [state, dispatch] = useFormState<AddressFormResult, FormData>(
    mode === "add" ? addAddressAction : updateAddressAction,
    { success: false }
  );

  if (state.success) {
    onClose();
    return null;
  }

  return (
    <form
      action={(fd) => {
        setSubmitting(true);
        dispatch(fd);
      }}
      className="space-y-4"
    >
      {state.error && (
        <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red">
          {state.error}
        </div>
      )}

      {mode === "edit" && (
        <input type="hidden" name="id" value={address?.id} />
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
          Address Line 1 *
        </label>
        <input
          type="text"
          name="line1"
          required
          defaultValue={address?.line1 || ""}
          className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
          placeholder="123 Mountain Pass Road"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
          Address Line 2
        </label>
        <input
          type="text"
          name="line2"
          defaultValue={address?.line2 || ""}
          className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
          placeholder="Apt, Suite, Unit"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            defaultValue={address?.city || ""}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="Los Angeles"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            State *
          </label>
          <input
            type="text"
            name="state"
            required
            defaultValue={address?.state || ""}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="CA"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            ZIP *
          </label>
          <input
            type="text"
            name="zip"
            required
            defaultValue={address?.zip || ""}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="90001"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            Country
          </label>
          <input
            type="text"
            name="country"
            defaultValue={address?.country || "US"}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ds-gray-300 cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.isDefault}
          className="h-4 w-4 rounded border-white/20 bg-ds-black-charcoal text-ds-red focus:ring-ds-red/40"
        />
        Set as default address
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting
            ? "Saving..."
            : mode === "add"
              ? "Add Address"
              : "Save Changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AddressesPage({
  addresses: initialAddresses,
}: {
  addresses: Address[];
}) {
  const [showForm, setShowForm] = useState<"add" | "edit" | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ds-white sm:text-3xl">
            Addresses
          </h1>
          <p className="mt-1 text-ds-gray-300">Manage your shipping addresses.</p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingAddress(null);
              setShowForm("add");
            }}
          >
            + Add Address
          </Button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-ds-red/20 bg-ds-black-charcoal p-6">
          <h2 className="mb-4 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
            {showForm === "add" ? "New Address" : "Edit Address"}
          </h2>
          <AddressForm
            mode={showForm}
            address={editingAddress || undefined}
            onClose={() => setShowForm(null)}
          />
        </div>
      )}

      {/* Address List */}
      {initialAddresses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ds-black-darkgray">
            <svg
              className="h-8 w-8 text-ds-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>
          <p className="text-ds-gray-400">No saved addresses.</p>
          <p className="text-sm text-ds-gray-600 mt-1">
            Add one now for faster checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {initialAddresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-ds-white">
                    {addr.line1}
                  </p>
                  {addr.line2 && (
                    <p className="text-sm text-ds-gray-300">{addr.line2}</p>
                  )}
                  <p className="mt-1 text-sm text-ds-gray-300">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p className="text-xs text-ds-gray-400">{addr.country}</p>
                </div>
                {addr.isDefault && (
                  <span className="shrink-0 rounded-full bg-ds-red/10 px-2.5 py-0.5 text-xs font-medium text-ds-red">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2 border-t border-white/[0.06] pt-3">
                <button
                  onClick={() => {
                    setEditingAddress(addr);
                    setShowForm("edit");
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete this address?")) {
                      await deleteAddressAction(addr.id);
                      window.location.reload();
                    }
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:bg-ds-red/10 hover:text-ds-red"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
