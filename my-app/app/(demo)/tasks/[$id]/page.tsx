
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
import { Dot } from 'lucide-react';
import { CiCalendarDate } from "react-icons/ci";

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
              Task detail
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section>
        <div>
          <ul className="flex flex-col list-disc">
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Task Created</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.created_at}</p>
              </div>
            </li>
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Task Verified</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.verified_at ? new Date(task.verified_at).toLocaleDateString() : 'N/A'}</p>
              </div>
              
            </li>
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Task Completed</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.completed_at ? new Date(task.verified_at).toLocaleDateString() : 'N/A'}</p>

              </div>
            </li>
          </ul>
          <p className="font-semibold text-xs text-zinc-500 mt-2">Due date: {task.due_date}</p>

        </div>
        <div className="mt-4">
          <h1 className="font-semibold text-lg text-zinc-900">Details</h1>
          <div className="flex flex-row mt-4">
            <div className="bg-gray-100 w-[1.5rem] h-[1.5rem] rounded mr-4 items-center justify-center">
              <CiCalendarDate />
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-xs text-zinc-900">{task.title}</h2>
              <p className="font-semibold text-xs text-zinc-500">{task.description}</p>
            </div>
          </div>
        </div>
      </section>
    </ContentLayout>
  );
}