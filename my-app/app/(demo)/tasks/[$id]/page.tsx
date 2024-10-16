
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
import { getTaskById } from "@/lib/actions/task.action";
// import { Payment, columns } from "@/components/table/columns"
// import { getData } from "./data"
// import { getLoggedInUser } from "@/lib/actions/user.action";
// import Tasktabs from "@/components/task-components/Tasktabs";

export default async function TaskPage({ params: { $id } }: { params: { $id: string } }) {
  const fetchTask = await getTaskById($id);
  const task = fetchTask;

  console.log(task)
  return (
    <ContentLayout title="Task Page">
      
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
              Task Page
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>{fetchTask.title}</h1>
    </ContentLayout>
  );
}