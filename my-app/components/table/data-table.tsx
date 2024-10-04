import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatDateTime } from '@/lib/utils';

const DataTable = ({ tasks }: TasksProps) => {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Title</TableHead>
            <TableHead className="px-2">Due date</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Priority</TableHead>
            {/* <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead> */}
          </TableRow>
        </TableHeader>


        <TableBody>
          <TableRow>
            {tasks.map((t: Task) => {
              return (
                <TableHeader key={t.task_id}>
                  <TableCell className="max-w-[250px] pl-2 pr-10">
                    <div className="flex items-center">
                      <h1>{t.title}</h1>
                    </div>
                  </TableCell>

                  <TableCell className="pl-2 pr-10 min-w-32">
                    {t.due_date}
                  </TableCell>

                  <TableCell className="pl-2 pr-10">
                    {t.status}
                  </TableCell>

                  <TableCell className="pl-2 pr-10 capitalize min-w-24">
                    {t.priority}
                  </TableCell>
                </TableHeader>
              )
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default DataTable