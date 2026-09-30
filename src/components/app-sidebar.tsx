"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { mockGithubRepos, mockConfluencePages, ConfluencePage } from "@/lib/mock-data"
import { GitBranch, FileText, ShieldCheck, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { ReltioBrainLogo } from '@/components/reltio-brain-logo';

export function BrandHeader() {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="p-1.5 bg-blue-600 text-white rounded-md">
        <ReltioBrainLogo className="w-6 h-6" />
      </div>
      <span className="font-bold text-lg tracking-tight">Enterpise AI Hub</span>
    </div>
  );
}

export function AppSidebar() {
  const [selectedPage, setSelectedPage] = useState<ConfluencePage | null>(null);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <BrandHeader />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link href="/" className="flex items-center gap-2 w-full">
                    <LayoutDashboard suppressHydrationWarning className="h-4 w-4 text-primary" />
                    <span>Kanban Board</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System & Security</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link href="/audit" className="flex items-center gap-2 w-full">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Trust & Audit Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GitHub Repositories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockGithubRepos.map((repo) => (
                <SidebarMenuItem key={repo.name}>
                  <SidebarMenuButton>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full">
                      <GitBranch className="h-4 w-4" />
                      <span>{repo.name}</span>
                      {repo.openPrs > 0 && (
                        <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          {repo.openPrs} PRs
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Confluence Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockConfluencePages.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPage(page);
                      }}
                      className="flex items-center gap-2 w-full"
                    >
                      <FileText suppressHydrationWarning className="h-4 w-4" />
                      <span className="truncate">{page.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={!!selectedPage} onOpenChange={(open) => !open && setSelectedPage(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <FileText suppressHydrationWarning className="h-5 w-5 text-blue-500" />
              </div>
              <DialogTitle>{selectedPage?.title}</DialogTitle>
            </div>
            <DialogDescription className="font-mono text-xs">
              ID: {selectedPage?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted rounded-md text-sm leading-relaxed border border-border/50 text-foreground">
            {selectedPage?.content}
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
