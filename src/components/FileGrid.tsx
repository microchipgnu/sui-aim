import { Button } from "@/components/ui/button"
import { CodeFile } from "@/lib/filesystem"

interface FileGridProps {
  files: CodeFile[]
  onFileSelect: (file: CodeFile) => void
}

export function FileGrid({ files, onFileSelect }: FileGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {files.map((file, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onFileSelect(file)}
          className="w-full h-full p-6 text-left border border-purple-500/30 bg-black/40 backdrop-blur-sm rounded-xl 
            transition-all duration-300 ease-in-out overflow-hidden
            hover:scale-105 hover:bg-purple-900/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <div className="w-full">
            <h2 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors truncate">{file.path}</h2>
            <p className="text-gray-400 mt-2 group-hover:text-purple-300 transition-colors truncate">Click to edit and run code</p>
          </div>
        </Button>
      ))}
    </div>
  )
}