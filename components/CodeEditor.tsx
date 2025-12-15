import React from 'react';
import { GeneratedCode } from '../types';
import { Copy, Download, Check, FileCode, Box } from 'lucide-react';

interface CodeEditorProps {
  data: GeneratedCode;
  onCodeChange: (newCode: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ data, onCodeChange }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([data.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-forge-card rounded-xl border border-forge-border overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-forge-border">
        <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="h-4 w-px bg-forge-border mx-2"></div>
            <span className="text-sm font-mono text-gray-400 flex items-center gap-2">
                <FileCode size={14} />
                {data.filename}
            </span>
        </div>
        <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-all"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-aws-orange/10 text-aws-orange hover:bg-aws-orange/20 rounded-md transition-all border border-aws-orange/20"
            >
              <Download size={14} />
              Download
            </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto relative group">
        <textarea
          value={data.code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full p-4 bg-[#0d1117] text-gray-300 font-mono text-sm resize-none focus:outline-none selection:bg-aws-orange/30"
          spellCheck={false}
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-900 border-t border-forge-border text-sm text-gray-400">
        <div className="mb-2 font-medium text-gray-300 flex items-center gap-2">
            <Box size={14} /> Dependencies
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
            {data.dependencies.length > 0 ? (
                data.dependencies.map(dep => (
                    <span key={dep} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-blue-400">
                        {dep}
                    </span>
                ))
            ) : (
                <span className="text-xs text-gray-600 italic">No external dependencies required</span>
            )}
        </div>
        <div className="p-3 bg-slate-800/50 rounded border border-slate-700/50">
            <p className="leading-relaxed text-gray-400 text-xs">
                <strong className="text-gray-300 block mb-1">Explanation:</strong>
                {data.explanation}
            </p>
        </div>
      </div>
    </div>
  );
};
