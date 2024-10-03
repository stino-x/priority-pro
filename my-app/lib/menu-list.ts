import {
  Bell,
  CheckCircle,
  MessageCircle,
  ClipboardList,
  ArrowRightCircle,
  BarChart,
  LucideIcon,
  AlertTriangle,
  LayoutGrid
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  // icon: React.ElementType;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, can_assign_tasks : boolean): Group[] {
  return [
    {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: LayoutGrid,
            submenus: []
          }
        ]
      },
    {
      groupLabel: "General",
      menus: [
        {
          href: "/notifications",
          label: "Notifications",
          active: pathname.includes("/notifications"),
          icon: Bell,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Tasks",
      menus: [
        {
          href: "/my-tasks",
          label: "My Tasks",
          active: pathname.includes("/my-tasks"),
          icon: ClipboardList,
          submenus: []
        },
        {
          href: "/verified-tasks",
          label: "Verified Tasks",
          active: pathname.includes("/verified-tasks"),
          icon: CheckCircle,
          submenus: []
        },
        ...(can_assign_tasks
          ? [
            {
              href: "/assigntask",
              label: "Assign Tasks",
              active: pathname.includes("/assign-tasks"),
              icon: ArrowRightCircle,
              submenus: []
            }
          ]
          : []),
        {
          href: "/priority-board",
          label: "Priority Board",
          active: pathname.includes("/priority-board"),
          icon: AlertTriangle,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Feedback & Performance",
      menus: [
        {
          href: "/feedback",
          label: "Feedback",
          active: pathname.includes("/feedback"),
          icon: MessageCircle,
          submenus: []
        },
        {
          href: "/performance",
          label: "Performance",
          active: pathname.includes("/performance"),
          icon: BarChart,
          submenus: []
        }
      ]
    }
  ];
}

