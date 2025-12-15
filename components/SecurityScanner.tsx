import React, { useState } from 'react';
import { SecurityReport } from '../types';
import { analyzeCodeSecurity } from '../services/geminiService';
import { Shield, AlertTriangle, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';

interface SecurityScannerProps {
  code: string;
  language: string;
}

export const SecurityScanner: React.FC<SecurityScannerProps> = ({ code, language }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SecurityReport | null>(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      const result = await analyzeCodeSecurity(code, language);
      setReport(result);
    } catch (e) {
      console.error(e);
      alert("Security scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-forge-border">
      <div className="p-4 border-b border-forge-border">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-3">
            <Shield size={16} /> Security Scan
        </h3>
        
        {!report || loading ? (
             <div className="bg-slate-800 rounded-lg p-4 text-center">
                 <p className="text-xs text-gray-400 mb-3">
                     Analyze your function for vulnerabilities, IAM issues, and best practices.
                 </p>
                 <button
                    onClick={handleScan}
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                 >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                    {loading ? 'Analyzing...' : 'Run Scan'}
                 </button>
             </div>
        ) : (
             <div className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700">
                 <div className="flex flex-col">
                     <span className="text-xs text-gray-500">Security Score</span>
                     <span className={`text-xl font-bold ${
                         report.score >= 80 ? 'text-green-500' : 
                         report.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                     }`}>
                         {report.score}/100
                     </span>
                 </div>
                 <button
                    onClick={handleScan}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                 >
                    Re-scan
                 </button>
             </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {report && (
            <>
                <div className="mb-4">
                    <p className="text-xs text-gray-400 italic">{report.summary}</p>
                </div>
                {report.issues.length === 0 ? (
                    <div className="text-green-500 flex items-center gap-2 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        <CheckCircle size={16} /> No issues found!
                    </div>
                ) : (
                    report.issues.map((issue, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg border border-slate-700 p-3">
                            <div className="flex items-center gap-2 mb-1">
                                {issue.severity === 'high' && <AlertTriangle size={14} className="text-red-500" />}
                                {issue.severity === 'medium' && <AlertTriangle size={14} className="text-yellow-500" />}
                                {issue.severity === 'low' && <Shield size={14} className="text-blue-500" />}
                                <span className={`text-xs font-bold uppercase ${
                                    issue.severity === 'high' ? 'text-red-500' : 
                                    issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                }`}>
                                    {issue.severity}
                                </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-200 mb-1">{issue.title}</h4>
                            <p className="text-xs text-gray-400 mb-2">{issue.description}</p>
                            <div className="bg-slate-900/50 p-2 rounded text-xs text-gray-300 border-l-2 border-blue-500">
                                <span className="text-blue-400 font-semibold">Fix: </span>
                                {issue.suggestion}
                            </div>
                        </div>
                    ))
                )}
            </>
        )}
      </div>
    </div>
  );
};
