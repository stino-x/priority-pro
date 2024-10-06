"use client"

import { Task } from "@/lib/interfaces/interface"
import { ColumnDef } from "@tanstack/react-table"

// export type Payment = {
//   title: string
//   due_date: string
//   priority: number
//   status:  boolean
// }

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="text-left font-semibold">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Due date",
    cell: ({ row }) => (
      <div className="">{row.original.due_date.toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      (row.original.priority < 3 ?
        <div className="text-center w-12 h-12 bg-[rgb(225,66,66)] rounded-full text-2xl">{row.original.priority}</div>
      : <div className="text-center w-12 h-12 bg-[#4bec3c] rounded-full text-2xl">{row.original.priority}</div>)
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      (row.original.is_verified === true ? 
        <div className="text-center px-2 bg-[#F5F2F0] rounded-8"
      >
        Completed
      </div>
      : <div className="text-center px-2 bg-[#F5F2F0] rounded-8"
      >
        Not Started
      </div>)
      
    ),
  },
]