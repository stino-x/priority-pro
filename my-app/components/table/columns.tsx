"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  task: number
  due_date: string
  assignee: string
  status:  "Not Started" | "In Progress" | "Completed"
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "task",
    header: "Task",
    cell: ({ row }) => (
      <div className="text-left font-semibold">{row.original.task}</div>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Due date",
    cell: ({ row }) => (
      <div className="text-center text-blue-600">{row.original.due_date}</div>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <div className="text-left px-2 text-gray-800">{row.original.assignee}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`text-center font-bold ${
          row.original.status === "Completed"
            ? "text-green-500"
            : row.original.status === "In Progress"
            ? "text-yellow-500"
            : "text-red-500"
        }`}
      >
        {row.original.status}
      </div>
    ),
  },
]
