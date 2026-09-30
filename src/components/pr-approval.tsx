"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitPullRequest, CheckCircle2, XCircle, Edit3, Send, Code, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { CodeDiffViewer } from "./code-diff-viewer";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface PrApprovalProps {
  repo: string;
  codeChanges?: string;
  fileChanges?: { fileName: string; originalCode: string; newCode: string }[];
  status: 'pending' | string;
  onAction: (action: string) => void;
}

export function PrApproval({ repo, codeChanges, fileChanges, status, onAction }: PrApprovalProps) {
  const [modifyMode, setModifyMode] = useState(false);
  const [modifyText, setModifyText] = useState("");

  return (
    <Card className="w-full max-w-xl border-blue-500/20 shadow-md">
      <CardHeader className="bg-blue-500/5 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <GitPullRequest className="h-5 w-5 text-blue-500" />
          </div>
          <CardTitle className="text-base flex-1">Proposed Pull Request</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {repo}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm max-h-[60vh] overflow-y-auto">
        <p className="font-medium mb-3">Code Changes Overview:</p>

        {fileChanges && fileChanges.length > 0 ? (
          <div className="flex flex-col gap-4">
            {fileChanges.map((file, idx) => (
              <CodeDiffViewer
                key={idx}
                fileName={file.fileName}
                originalCode={file.originalCode}
                newCode={file.newCode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-border/50 text-muted-foreground">
            {codeChanges || "No changes specified."}
          </div>
        )}
      </CardContent>
      {status === 'pending' ? (
        <CardFooter className="flex flex-col gap-3 p-4 pt-0 border-t mt-4 border-border/50">
          {!modifyMode ? (
            <div className="flex flex-col gap-3 w-full mt-4">
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  onClick={() => onAction('approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve PR
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setModifyMode(true)}
                  className="flex-1"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Modify Code
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onAction('rejected')}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger render={<div className="w-full" />}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        toast("Handing off to local...", {
                          description: "Spinning up a localized AI Hub session in VS Code...",
                          icon: <Code className="h-4 w-4 text-blue-400" />,
                        });
                        onAction('handoff');
                      }}
                      className="w-full opacity-60 border-dashed border-border/50 bg-secondary/30 hover:opacity-100 hover:bg-secondary/50 transition-all"
                    >
                      <Code className="mr-2 h-4 w-4 text-muted-foreground" />
                      Open in Local IDE (Cursor / VS Code)
                      <Lock className="ml-2 h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>V2 Feature: Local context handoff via .enterprise-ai-hub-context</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full mt-4">
              <Textarea
                placeholder="How should the agent modify this code? (e.g., 'Change the limit to 20 instead')"
                value={modifyText}
                onChange={(e) => setModifyText(e.target.value)}
                className="min-h-[80px] text-sm focus-visible:ring-1"
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setModifyMode(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!modifyText.trim()}
                  onClick={() => onAction(`Modify request: ${modifyText}`)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      ) : (
        <CardFooter className="p-4 pt-0">
          <div className={`w-full text-center p-2 rounded-md text-sm font-medium mt-4 ${status === 'approved' ? 'bg-green-500/10 text-green-600' :
            status === 'rejected' ? 'bg-red-500/10 text-red-600' :
              'bg-yellow-500/10 text-yellow-600'
            }`}>
            {status === 'approved' && 'Pull Request Approved & Created! 🎉'}
            {status === 'rejected' && 'Pull Request Rejected.'}
            {status !== 'approved' && status !== 'rejected' && `Requested modification: "${String(status).replace('Modify request: ', '')}"`}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
