
import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getTasks } from "@/lib/actions/task.action";
// import { Payment, columns } from "@/components/table/columns"
import { getData } from "./data"
import { getLoggedInUser } from "@/lib/actions/user.action";
import PaginationTable from "@/components/table/pagination";
import DataTable from "@/components/table/data-table";
import Tasktabs from "@/components/task-components/Tasktabs";

export default async function MyTasks({ searchParams: {id, page }}: SearchParamProps) {
  // const { activeTab } = useTabState();
  // const task = getFilteredTasks(activeTab);
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const task = await getTasks();
  //console.log(task.reverse());

  if(!task) return;

  const accountsData = task?.documents;
  //console.log(accountsData)
  const appwriteItemId = (id as string) || accountsData?.appwriteItemId;

  const rowsPerPage = 5;
  const totalPages = Math.ceil(task?.documents.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTasks = task?.documents.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <ContentLayout title="My Tasks">
      <Tasktabs />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              My Tasks
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DataTable tasks={currentTasks} />
        {totalPages > 1 && (
          <div className="my-4 w-full">
            <PaginationTable totalPages={totalPages} page={currentPage} />
          </div>
        )}
    </ContentLayout>
  );
}