import React, { useState, useMemo } from 'react';
import { CodeLanguage, Snippet } from '../types';
import { snippetService } from '../services/snippetService';
import { Search, Plus, Code } from 'lucide-react';

interface SnippetLibraryProps {
  language: CodeLanguage;
  onInsert: (code: string) => void;
}

export const SnippetLibrary: React.FC<SnippetLibraryProps> = ({ language, onInsert }) => {
  const [search, setSearch] = useState('');

  const snippets = useMemo(() => {
    return snippetService.searchSnippets(search, language);
  }, [search, language]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-forge-border">
      <div className="p-4 border-b border-forge-border">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-3">
            <Code size={16} /> Snippet Library
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aws-orange"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {snippets.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No snippets found for {language}
          </div>
        ) : (
          snippets.map((snippet) => (
            <div 
              key={snippet.id} 
              className="group bg-slate-800/50 border border-slate-700 hover:border-aws-orange/50 rounded-lg p-3 transition-all"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-gray-300 text-sm">{snippet.title}</span>
                <button
                  onClick={() => onInsert(snippet.code)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-aws-orange hover:text-white rounded transition-all text-gray-400"
                  title="Insert Code"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{snippet.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
