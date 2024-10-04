import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from '@/lib/utils';

const DataTable = ({ tasks }: TasksProps) => {

  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow className="justify-around">
          <TableHead className="px-2">Title</TableHead>
          <TableHead className="px-2">Due Date</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Priority</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((t: Task) => (
          <TableRow key={t.task_id} className="!over:bg-none !border-b-default">
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
