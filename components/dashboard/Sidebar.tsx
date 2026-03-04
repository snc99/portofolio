"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/auth.client";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarMenuSkeleton } from "@/components/ui/sidebar";

import {
  Briefcase,
  Info,
  Layers,
  LayoutDashboard,
  SquareTerminal,
  User,
} from "lucide-react";

import { NavMain } from "./Navmain";
import { NavUser } from "./Navuser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.me();
        if (res.success) {
          setUser({
            name: res.data.name || "Irvan Sandy",
            email: res.data.email,
            avatar: "/avatar.png",
          });
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard",
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
        isActive: pathname === "/dashboard/profile",
      },
      {
        title: "About",
        url: "/dashboard/about",
        icon: Info,
        isActive: pathname === "/dashboard/about",
      },
      {
        title: "Skill",
        url: "/dashboard/skills",
        icon: SquareTerminal,
        isActive: pathname === "/dashboard/skills",
      },
      {
        title: "Work Experience",
        url: "/dashboard/work-experience",
        icon: Briefcase,
        isActive: pathname === "/dashboard/work-experience",
      },
      {
        title: "Project",
        url: "/dashboard/project",
        icon: Layers,
        isActive: pathname === "/dashboard/project",
      },
    ],
  };

  return (
    <Sidebar
      collapsible="icon"
      className="w-[--sidebar-width] bg-white text-gray-900 p-0 [&>button]:hidden"
      {...props}
    >
      {/* 🔥 HEADER */}
      <SidebarHeader className="border-b border-emerald-100">
        <div
          className={`
      py-5 transition-all duration-200
      ${state === "collapsed" ? "flex justify-center" : "px-4"}
    `}
        >
          <div
            className={`
        flex items-center
        ${state === "collapsed" ? "" : "gap-3"}
      `}
          >
            <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              IS
            </div>

            {state === "expanded" && (
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">
                  Portfolio Admin
                </p>
                <p className="text-xs text-gray-400">Manage your content</p>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      {/* 🔥 CONTENT */}
      <SidebarContent className="px-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        {loading ? (
          <div className="space-y-2 px-2 py-4">
            {[...Array(6)].map((_, i) => (
              <SidebarMenuSkeleton key={i} showIcon />
            ))}
          </div>
        ) : (
          <NavMain items={data.navMain} />
        )}
      </SidebarContent>

      {/* 🔥 FOOTER */}
      <SidebarFooter className="border-t border-emerald-100">
        {loading ? (
          <div className="p-4">
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ) : (
          <NavUser user={user!} />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
