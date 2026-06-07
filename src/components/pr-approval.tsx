"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitPullRequest, CheckCircle2, XCircle, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeDiffViewer } from "./code-diff-viewer";

interface PrApprovalProps {
  repo: string;
  codeChanges?: string;
  fileChanges?: { fileName: string; originalCode: string; newCode: string }[];
  status: 'pending' | 'approved' | 'rejected' | 'modify';
  onAction: (action: 'approved' | 'rejected' | 'modify') => void;
}

export function PrApproval({ repo, codeChanges, fileChanges, status, onAction }: PrApprovalProps) {
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
        <CardFooter className="flex gap-2 p-4 pt-0 border-t mt-4 border-border/50">
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
            onClick={() => onAction('modify')}
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
        </CardFooter>
      ) : (
        <CardFooter className="p-4 pt-0">
          <div className={`w-full text-center p-2 rounded-md text-sm font-medium ${status === 'approved' ? 'bg-green-500/10 text-green-600' :
            status === 'rejected' ? 'bg-red-500/10 text-red-600' :
              'bg-yellow-500/10 text-yellow-600'
            }`}>
            {status === 'approved' && 'Pull Request Approved & Created! 🎉'}
            {status === 'rejected' && 'Pull Request Rejected.'}
            {status === 'modify' && 'Requested AI to modify the code...'}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
