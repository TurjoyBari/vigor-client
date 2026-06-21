"use client";

import { motion } from "framer-motion";
import { cn, dashboardClasses, DASHBOARD_ANIMATION } from "@/lib/dashboard/theme";
import LoadingSkeleton from "@/components/dashboard/ui/LoadingSkeleton";
import EmptyState from "@/components/dashboard/ui/EmptyState";

/**
 * Reusable data table for dashboard pages.
 *
 * @example
 * const columns = [
 *   { key: "name", label: "Class Name" },
 *   { key: "trainer", label: "Trainer" },
 *   { key: "schedule", label: "Schedule" },
 *   {
 *     key: "actions",
 *     label: "Actions",
 *     render: (row) => <button>View</button>,
 *   },
 * ];
 *
 * <DataTable columns={columns} data={rows} />
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyPreset = "default",
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
  onEmptyAction,
  rowKey = "id",
  className = "",
  stickyHeader = true,
  compact = false,
  onRowClick,
}) {
  if (loading) {
    return (
      <LoadingSkeleton
        variant="table"
        rows={5}
        columns={columns.length || 4}
        className={className}
      />
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        preset={emptyPreset}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
        onAction={onEmptyAction}
        className={className}
      />
    );
  }

  const getRowKey = (row, index) => {
    if (typeof rowKey === "function") return rowKey(row, index);
    return row[rowKey] ?? index;
  };

  const getCellValue = (row, column, index) => {
    if (column.render) {
      return column.render(row, index);
    }

    const value = row[column.key];
    if (value === null || value === undefined || value === "") {
      return <span className="text-on-surface-variant/60">—</span>;
    }

    return value;
  };

  return (
    <motion.div
      className={cn(dashboardClasses.tableWrapper, className)}
      initial={DASHBOARD_ANIMATION.fadeIn.initial}
      animate={DASHBOARD_ANIMATION.fadeIn.animate}
      transition={DASHBOARD_ANIMATION.fadeIn.transition}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead
            className={cn(
              dashboardClasses.tableHead,
              stickyHeader && "sticky top-0 z-10 backdrop-blur-xl"
            )}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 md:px-6 py-4 text-left font-geist-label font-semibold",
                    compact ? "py-3" : "py-4",
                    column.headerClassName
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={getRowKey(row, rowIndex)}
                className={cn(
                  dashboardClasses.tableRow,
                  onRowClick && "cursor-pointer"
                )}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.04, duration: 0.2 }}
                onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={`${getRowKey(row, rowIndex)}-${column.key}`}
                    className={cn(
                      "px-4 md:px-6 font-hanken text-sm text-on-surface align-middle",
                      compact ? "py-3" : "py-4",
                      column.className
                    )}
                  >
                    {getCellValue(row, column, rowIndex)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
