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
import { mockGithubRepos, mockConfluencePages } from "@/lib/mock-data"
import { GitBranch, FileText, Zap } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-lg tracking-tight">Enterprise AI Hub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
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
                    <a href="#" className="flex items-center gap-2 w-full">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{page.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
