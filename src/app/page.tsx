import { createFileSystem } from "@/lib/filesystem"
import { FileEditor } from "@/components/FileEditor"

export default function Home() {
  const fileSystem = createFileSystem();
  const files = fileSystem.getAllFiles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Sui Agent Typhoon
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Try out intelligent reusable agentic workflows using Markdown.
          </p>
        </div>

        <FileEditor files={files} />
      </main>
    </div>
  );
}
