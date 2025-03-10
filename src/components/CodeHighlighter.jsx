import React, { useMemo } from 'react';

export const CodeHighlighter = ({ code }) => {
  // Memoize the highlighted code to prevent unnecessary re-renders
  const highlightedCode = useMemo(() => {
    if (!code) return '';
    
    // Replace keywords
    return code
      .replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|import|export|from|try|catch|finally|throw|async|await)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(function)\s+([a-zA-Z0-9_]+)/g, '<span class="keyword">function</span> <span class="function">$2</span>')
      .replace(/\b([a-zA-Z0-9_]+)\(/g, '<span class="function">$1</span>(')
      .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
      .replace(/('.*?'|".*?")/g, '<span class="string">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
  }, [code]);

  return (
    <pre className="algorithm-code">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};

export default React.memo(CodeHighlighter); 