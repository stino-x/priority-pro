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
      <div className="">{row.original.due_date}</div>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <div className="text-center w-12 h-12 bg-[#F5F2F0] rounded-full">{row.original.assignee}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-center px-2 bg-[#F5F2F0] rounded-4"
      >
        {row.original.status}
      </div>
    ),
  },
]
