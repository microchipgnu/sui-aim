"use client"

import { useState } from "react"
import { type CodeFile } from "@/lib/filesystem"
import { FileGrid } from "@/components/FileGrid"
import { EditorDialog } from "@/components/EditorDialog"

interface FileEditorProps {
  files: CodeFile[]
}

export function FileEditor({ files }: FileEditorProps) {
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value && selectedFile) {
      setCode(value);
    }
  }

  const handleRun = async (inputs?: Record<string, any>) => {
    setIsRunning(true);
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: code, inputs: inputs }),
      });
      const data = await response.text();
      setResult(data);
    } finally {
      setIsRunning(false);
    }
  }

  const openFile = (file: CodeFile) => {
    setSelectedFile(file);
    setCode(file.content);
    setResult("");
    setIsRunning(false);
  }

  const closeFile = () => {
    setSelectedFile(null);
    setCode("");
    setResult("");
    setIsRunning(false);
  }

  return (
    <>
      <FileGrid files={files} onFileSelect={openFile} />
      
      <EditorDialog
        file={selectedFile}
        code={code}
        result={result}
        isRunning={isRunning}
        onClose={closeFile}
        onCodeChange={handleEditorChange}
        onRun={handleRun}
        onBack={() => setResult("")}
      />
    </>
  )
} 