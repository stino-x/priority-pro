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
import { DataTable } from "@/components/table/data-table";
import {  columns } from "@/components/table/columns"
import { getData } from "./data"
import Tasktabs from "@/components/task-components/Tasktabs";
import { FilteredTasks } from "@/components/task-components/FilteredTasks";

export default async function CalendarPage() {
  // const data = await getData();
  const data = FilteredTasks();

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
      <DataTable columns={columns} data={data} />
    </ContentLayout>
  );
}