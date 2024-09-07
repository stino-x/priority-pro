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
  },
  {
    accessorKey: "due_date",
    header: "Due date",
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
