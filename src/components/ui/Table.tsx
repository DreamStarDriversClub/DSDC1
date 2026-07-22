import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T | ((row: T) => string);
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = "id" as keyof T,
  emptyMessage = "No data found.",
  loading = false,
  className,
}: TableProps<T>) {
  const getKey = (row: T): string => {
    if (typeof keyField === "function") return keyField(row);
    return String(row[keyField] ?? "");
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/[0.06]",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-ds-black/30 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-ds-gray-500",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-20 text-center"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-6 w-6 animate-spin text-ds-red"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-20 text-center"
                >
                  <p className="text-sm text-ds-gray-500">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={getKey(row)}
                  className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-5 py-3", col.className)}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
