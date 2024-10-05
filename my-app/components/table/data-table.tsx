import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from '@/lib/utils';

interface Task {
  task_id: string;
  title: string;
  due_date: string;
  status: boolean;
  priority: number;
}

interface TasksProps {
  tasks: Task[];
}

const DataTable = ({ tasks }: TasksProps) => {
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow className="justify-around">
            <TableHead className="px-2 font-bold">Title</TableHead>
            <TableHead className="px-2 font-bold">Due Date</TableHead>
            <TableHead className="px-2 font-bold">Status</TableHead>
            <TableHead className="px-2 font-bold">Priority</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((t: Task) => (
            <TableRow key={t.task_id} className="!hover:bg-none !border-b-default">
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center">
                  <h1>{t.title}</h1>
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10 min-w-32">
                {t.due_date}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <div className={`text-center px-2 rounded-8 ${t.status ? "bg-green-100" : "bg-gray-100"}`}>
                  {t.status ? "Completed" : "Not Started"}
                </div>
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                <div 
                  className={`text-center w-12 h-12 rounded-full text-xl flex items-center justify-center 
                    ${t.priority < 33 ? "bg-red-500" : "bg-green-500"} text-white`}
                >
                  {t.priority}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
