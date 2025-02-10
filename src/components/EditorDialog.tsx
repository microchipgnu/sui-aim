import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CodeFile } from "@/lib/filesystem"
import { configurePrismSyntax } from "@/lib/prism"
import MonacoEditor from '@monaco-editor/react'
import React from "react"
import yaml from 'yaml'

interface EditorDialogProps {
    file: CodeFile | null
    code: string
    result: string
    isRunning: boolean
    onClose: () => void
    onCodeChange: (value: string | undefined) => void
    onRun: (inputs?: Record<string, any>) => void
    onBack: () => void
}

export function EditorDialog({
    file,
    code,
    result,
    isRunning,
    onClose,
    onCodeChange,
    onRun,
    onBack
}: EditorDialogProps) {
    if (!file) return null;

    const [showInputDialog, setShowInputDialog] = React.useState(false);
    const [inputValues, setInputValues] = React.useState<Record<string, any>>({});

    // Parse frontmatter if present and extract input fields
    const hasFrontmatter = code.trim().startsWith('---');
    const frontmatterInputs = React.useMemo(() => {
        if (!hasFrontmatter) return null;
        
        try {
            // Extract content between first two --- markers
            const matches = code.match(/^---\n([\s\S]*?)\n---/);
            if (!matches) return null;
            
            const frontmatterContent = matches[1];
            const parsed = yaml.parse(frontmatterContent);
            
            // Check if input field exists and is an array
            if (!parsed?.input || !Array.isArray(parsed.input)) {
                return null;
            }

            // Validate and transform input fields
            const inputs = parsed.input.map((field: {
                type?: string;
                name?: string;
                description?: string;
                required?: boolean;
                default?: any;
            }) => {
                if (typeof field !== 'object') return null;
                
                // Ensure required properties exist
                if (!field.type || !field.name) return null;
                
                return {
                    type: field.type,
                    name: field.name,
                    description: field.description || '',
                    required: field.required ?? true,
                    default: field.default
                };
            }).filter(Boolean);
            
            return inputs.length > 0 ? inputs : null;
            
        } catch (e) {
            console.error('Error parsing frontmatter:', e);
            return null;
        }
    }, [code, hasFrontmatter]);

    const handleRunClick = () => {
        if (frontmatterInputs) {
            setShowInputDialog(true);
        } else {
            onRun();
        }
    };

    const handleInputSubmit = () => {
        setShowInputDialog(false);
        onRun(inputValues);
    };

    return (
        <>
            <Dialog open={file !== null} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className={`max-w-4xl bg-gray-900/95 ${isRunning ? 'shadow-lg' : 'border-purple-500/30'}`}>
                    <DialogTitle className="text-white mb-4">
                        {file.path}
                    </DialogTitle>

                    <div className={`relative h-[70vh] ${isRunning ? 'bg-purple-500/5 transition-colors duration-1000' : ''}`}>
                        {!result ? (
                            <MonacoEditor
                                height="100%"
                                defaultLanguage="aim"
                                theme="aim-dark"
                                value={code}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    scrollBeyondLastLine: false,
                                    lineNumbers: 'on',
                                    padding: { top: 8 },
                                    fontFamily: 'JetBrains Mono, monospace',
                                    readOnly: true
                                }}
                                beforeMount={configurePrismSyntax}
                            />
                        ) : (
                            <div className="h-full overflow-y-auto">
                                <div className="output-preview p-4 bg-black/50 rounded-md text-sm text-gray-300">
                                    <style scoped>
                                        {`
                                .output-preview h1 {
                                    font-size: 1.5rem;
                                    font-weight: 600;
                                    color: rgb(229, 231, 235);
                                    padding-top: 0.75rem;
                                    padding-bottom: 0.75rem;
                                    margin-top: 0.75rem;
                                    margin-bottom: 0.75rem;
                                    line-height: 1.75;
                                }

                                .output-preview p {
                                    display: block;
                                    padding: 0.5rem 0;
                                    margin: 0.5rem 0;
                                    color: #d1d5db;
                                    line-height: 1.6;
                                    font-size: 1rem;
                                }

                                .output-preview ai {
                                    display: block;
                                    padding: 0.75rem 1rem;
                                    margin: 0.5rem 0.25rem;
                                    border: 1px solid #3b82f6;
                                    border-radius: 0.375rem;
                                    background-color: rgba(59, 130, 246, 0.1);
                                    color: #60a5fa;
                                    font-weight: 500;
                                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                                    transition: all 0.2s ease;
                                    cursor: pointer;
                                    position: relative;
                                }

                                .output-preview ai:before {
                                    content: "▼";
                                    position: absolute;
                                    right: 1rem;
                                    top: 0.75rem;
                                    transition: transform 0.2s ease;
                                }

                                .output-preview ai.collapsed:before {
                                    transform: rotate(-90deg);
                                }

                                .output-preview ai.collapsed > *:not(:first-child) {
                                    display: none;
                                }

                                .output-preview ai:hover {
                                    background-color: rgba(59, 130, 246, 0.2);
                                    border-color: #60a5fa;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                                }

                                .output-preview if {
                                    display: block;
                                    padding: 0.75rem;
                                    margin: 0.5rem 0;
                                    border: 2px solid #3b82f6;
                                    border-radius: 0.375rem;
                                    background-color: rgba(59, 130, 246, 0.1);
                                    position: relative;
                                }

                                .output-preview else {
                                    display: block;
                                    padding: 0.75rem;
                                    margin: 0.5rem 0;
                                    border: 1px solid #3b82f6;
                                    border-radius: 0.375rem;
                                    background-color: rgba(59, 130, 246, 0.1);
                                    color: #60a5fa;
                                    font-weight: 500;
                                }

                                .output-preview loop {
                                    display: block;
                                    padding: 1rem;
                                    margin: 1rem 0;
                                    border: 2px solid #374151;
                                    border-radius: 0.5rem;
                                    background-color: rgba(31, 41, 55, 0.5);
                                    position: relative;
                                }

                                .output-preview .loading {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    height: 1.5rem;
                                    width: 1.5rem;
                                }

                                .output-preview .loading div {
                                    animation: spin 1s linear infinite;
                                    height: 1rem;
                                    width: 1rem;
                                    border-radius: 9999px;
                                    border-bottom: 2px solid #60a5fa;
                                }

                                @keyframes spin {
                                    to {
                                        transform: rotate(360deg);
                                    }
                                }

                                .animate-fadeIn {
                                    animation: fadeIn 0.2s ease-in;
                                }

                                @keyframes fadeIn {
                                    from {
                                        opacity: 0;
                                    }
                                    to {
                                        opacity: 1;
                                    }
                                }
                                `}
                                    </style>
                                    <div dangerouslySetInnerHTML={{ __html: result }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        {!result ? (
                            <Button
                                onClick={handleRunClick}
                                disabled={isRunning}
                                className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 ${isRunning ? 'animate-pulse' : ''}`}
                            >
                                {isRunning ? (
                                    <>
                                        <div className="loading mr-2">
                                            <div />
                                        </div>
                                        Running...
                                    </>
                                ) : (
                                    'Run Code'
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={onBack}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                                Back to Code
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Input Dialog */}
            <Dialog open={showInputDialog} onOpenChange={setShowInputDialog}>
                <DialogContent className="bg-gray-900/95">
                    <DialogTitle className="text-white">Enter Input Values</DialogTitle>
                    <div className="space-y-4">
                        {frontmatterInputs?.map((field: {
                            type: string;
                            name: string;
                            description: string;
                            required: boolean;
                            default: any;
                        }) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-sm text-gray-300">
                                    {field.name}
                                    {field.description && (
                                        <span className="ml-2 text-gray-500">{field.description}</span>
                                    )}
                                </label>
                                <input
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                                    defaultValue={field.default}
                                    required={field.required}
                                    onChange={(e) => setInputValues(prev => ({
                                        ...prev,
                                        [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value
                                    }))}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={() => setShowInputDialog(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleInputSubmit}>
                                Run
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}