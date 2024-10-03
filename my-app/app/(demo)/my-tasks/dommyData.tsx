import { Payment, columns } from "@/components/table/columns"

export async function getData(): Promise<Payment[]> {
  return [
    {
      task: 1,
      due_date: "Mon 2",
      assignee: "DA",
      status: "In Progress",
    },
    {
      task: 2,
      due_date: "Mon 2",
      assignee: "TA",
      status: "Completed",
    },
    {
      task: 3,
      due_date: "Mon 3",
      assignee: "BR",
      status: "Completed",
    },
    {
      task: 4,
      due_date: "Mon 2",
      assignee: "KJ",
      status: "Not Started",
    },
    {
      task: 5,
      due_date: "Mon 5",
      assignee: "TT",
      status: "In Progress",
    },
    {
      task: 6,
      due_date: "Mon 6",
      assignee: "SF",
      status: "Not Started",
    },
  ]
}