import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CodeEditor } from './components/CodeEditor';
import { SnippetLibrary } from './components/SnippetLibrary';
import { SecurityScanner } from './components/SecurityScanner';
import { User, GeneratedCode, CodeLanguage } from './types';
import { mockAuthService } from './services/mockAuthService';
import { generateLambdaCode } from './services/geminiService';
import { historyService } from './services/historyService';
import { 
  Sparkles, 
  Github, 
  Chrome, 
  History, 
  ChevronRight, 
  Loader2, 
  Plus, 
  Code2,
  BookOpen,
  ShieldCheck,
  X
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('nodejs');
  const [currentCode, setCurrentCode] = useState<GeneratedCode | null>(null);
  const [history, setHistory] = useState<GeneratedCode[]>([]);
  
  // Right Sidebar State
  const [activeTool, setActiveTool] = useState<'snippets' | 'security' | null>(null);

  // Initialize
  useEffect(() => {
    const storedUser = mockAuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setHistory(historyService.getAll());
    }
  }, []);

  const handleLogin = async (provider: 'google' | 'github') => {
    setAuthLoading(true);
    try {
      const u = await mockAuthService.login(provider);
      setUser(u);
      setHistory(historyService.getAll());
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await mockAuthService.logout();
    setUser(null);
    setCurrentCode(null);
    setHistory([]);
    setPrompt('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateLambdaCode(prompt, language);
      const newCode: GeneratedCode = {
        id: `gen_${Date.now()}`,
        timestamp: Date.now(),
        prompt: prompt,
        ...result
      };
      
      historyService.save(newCode);
      setHistory(prev => [newCode, ...prev]);
      setCurrentCode(newCode);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: GeneratedCode) => {
    setCurrentCode(item);
    setPrompt(item.prompt);
    setLanguage(item.language);
  };

  const startNew = () => {
    setCurrentCode(null);
    setPrompt('');
  };

  const handleCodeChange = (newCodeStr: string) => {
    if (currentCode) {
      setCurrentCode({ ...currentCode, code: newCodeStr });
    }
  };

  const handleSnippetInsert = (snippetCode: string) => {
    if (currentCode) {
      // Simple append for now, ideally insert at cursor
      setCurrentCode({ 
        ...currentCode, 
        code: currentCode.code + "\n\n" + snippetCode 
      });
    }
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-forge-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aws-orange/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-md w-full bg-forge-card border border-forge-border rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-aws-orange to-orange-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Lambda Forge</h1>
            <p className="text-gray-400">
              Generate production-ready AWS Lambda functions in seconds using AI.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin('google')}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="animate-spin" /> : <Chrome size={20} />}
              Continue with Google
            </button>
            <button
              onClick={() => handleLogin('github')}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2f363d] transition-colors border border-gray-700 disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="animate-spin" /> : <Github size={20} />}
              Continue with GitHub
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-forge-border text-center">
            <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <Layout user={user} onLogout={handleLogout}>
      {/* Left Sidebar (History) */}
      <aside className="w-64 bg-slate-900 border-r border-forge-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-forge-border">
          <button 
            onClick={startNew}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            New Function
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <History size={12} /> Recent Generations
            </div>
            <div className="space-y-1 px-2">
                {history.length === 0 ? (
                    <div className="text-center py-8 px-4 text-gray-600 text-sm">
                        No history yet. Start generating!
                    </div>
                ) : (
                    history.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-colors group relative ${
                                currentCode?.id === item.id 
                                ? 'bg-slate-800 text-white border border-slate-700' 
                                : 'text-gray-400 hover:bg-slate-800/50 hover:text-gray-200'
                            }`}
                        >
                            <div className="font-medium truncate pr-4">{item.prompt}</div>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    item.language === 'nodejs' ? 'bg-green-500' : 
                                    item.language === 'python' ? 'bg-blue-500' : 'bg-red-500'
                                }`}></span>
                                <span className="truncate">
                                    {item.language === 'nodejs' ? 'Node' : item.language === 'python' ? 'Py' : 'Java'}
                                </span>
                                <span className="text-[10px] ml-auto opacity-60 flex-shrink-0">
                                    {new Date(item.timestamp).toLocaleDateString(undefined, { month:'numeric', day:'numeric'})}
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
      </aside>

      {/* Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50 relative">
        {/* Loading Overlay */}
        {loading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl mb-4 animate-pulse">
                    <Loader2 className="w-8 h-8 text-aws-orange animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-white">Forging Lambda...</h3>
                <p className="text-gray-400 mt-2">Analyzing requirements & generating boilerplate</p>
            </div>
        )}

        {/* Top Input Section */}
        <div className="p-6 border-b border-forge-border bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                            Describe your function
                        </label>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Read an image from S3 bucket 'uploads', resize it using sharp, and save to 'processed' bucket..."
                            className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-aws-orange/50 focus:border-aws-orange/50 focus:outline-none resize-none transition-all shadow-inner"
                        />
                    </div>
                    <div className="w-48 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Runtime</label>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setLanguage('nodejs')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                        language === 'nodejs'
                                        ? 'bg-green-500/10 border-green-500 text-green-400'
                                        : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-gray-600'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${language === 'nodejs' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                    Node.js 20.x
                                </button>
                                <button
                                    onClick={() => setLanguage('python')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                        language === 'python'
                                        ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                                        : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-gray-600'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${language === 'python' ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                                    Python 3.12
                                </button>
                                <button
                                    onClick={() => setLanguage('java')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                        language === 'java'
                                        ? 'bg-red-500/10 border-red-500 text-red-400'
                                        : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-gray-600'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${language === 'java' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                                    Java 17
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || loading}
                            className="w-full py-3 bg-aws-orange hover:bg-aws-hover text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={18} />
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Output Section with Right Tool Bar Toggle */}
        <div className="flex-1 overflow-hidden flex relative">
            <div className="flex-1 p-6 overflow-hidden">
                <div className="max-w-4xl mx-auto h-full">
                    {currentCode ? (
                        <CodeEditor data={currentCode} onCodeChange={handleCodeChange} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Code2 className="w-10 h-10 text-gray-500" />
                            </div>
                            <h2 className="text-xl font-medium text-gray-300">Ready to Forge</h2>
                            <p className="text-gray-500 max-w-sm mt-2">
                                Enter a prompt above and select your runtime to generate a secure, scalable AWS Lambda function.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tool Toggles */}
            {currentCode && (
                <div className="w-14 border-l border-forge-border bg-slate-900 flex flex-col items-center py-4 gap-4 z-20">
                    <button
                        onClick={() => setActiveTool(activeTool === 'snippets' ? null : 'snippets')}
                        className={`p-2 rounded-lg transition-colors ${activeTool === 'snippets' ? 'bg-aws-orange text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
                        title="Snippet Library"
                    >
                        <BookOpen size={20} />
                    </button>
                    <button
                        onClick={() => setActiveTool(activeTool === 'security' ? null : 'security')}
                        className={`p-2 rounded-lg transition-colors ${activeTool === 'security' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
                        title="Security Scan"
                    >
                        <ShieldCheck size={20} />
                    </button>
                </div>
            )}

            {/* Right Panel (Tools) */}
            {activeTool && currentCode && (
                <div className="w-80 border-l border-forge-border bg-slate-900 absolute right-14 top-0 bottom-0 z-30 shadow-2xl animate-in slide-in-from-right duration-200">
                    <div className="h-full relative">
                        {activeTool === 'snippets' && (
                            <SnippetLibrary 
                                language={currentCode.language} 
                                onInsert={handleSnippetInsert} 
                            />
                        )}
                        {activeTool === 'security' && (
                            <SecurityScanner 
                                code={currentCode.code} 
                                language={currentCode.language} 
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
}
