'use client'
import { useState } from 'react'
import { FiCheck, FiCopy, FiTerminal } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface CodeBlockProps {
  language: string
  value: string
  filename?: string
}

const languageNames: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  jsx: 'React JSX',
  tsx: 'React TSX',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Terminal',
  sql: 'SQL',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
}

// Özel syntax highlighting teması
const codeTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#e4e4e7', // Varsayılan metin rengi
    background: 'transparent',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '14px',
    textAlign: 'left' as const,
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: 1.5,
    tabSize: 4,
    hyphens: 'none',
  },
  // Sözdizimi renkleri
  'keyword': {
    color: '#c678dd', // mor
    fontStyle: 'italic'
  },
  'class-name': {
    color: '#e5c07b' // sarı
  },
  'function': {
    color: '#61afef' // mavi
  },
  'string': {
    color: '#98c379' // yeşil
  },
  'number': {
    color: '#d19a66' // turuncu
  },
  'boolean': {
    color: '#c678dd' // mor
  },
  'comment': {
    color: '#7f848e', // gri
    fontStyle: 'italic'
  },
  'operator': {
    color: '#56b6c2' // açık mavi
  },
  'punctuation': {
    color: '#abb2bf' // açık gri
  },
  'property': {
    color: '#e06c75' // kırmızı
  },
  'tag': {
    color: '#e06c75' // kırmızı
  },
  'attr-name': {
    color: '#d19a66' // turuncu
  },
  'attr-value': {
    color: '#98c379' // yeşil
  },
  'regex': {
    color: '#98c379' // yeşil
  },
  'important': {
    color: '#e06c75', // kırmızı
    fontWeight: 'bold'
  },
  'variable': {
    color: '#e06c75' // kırmızı
  },
  'constant': {
    color: '#d19a66' // turuncu
  }
}

export default function CodeBlock({ language, value, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayLanguage = languageNames[language] || language

  return (
    <div className="group rounded-lg overflow-hidden bg-[#282c34] mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] border-b border-[#181a1f]">
        <div className="flex items-center gap-3">
          <FiTerminal className="text-purple-400" />
          <div className="flex items-center gap-2">
            {filename && (
              <>
                <span className="text-sm text-gray-300">{filename}</span>
                <span className="text-gray-500">•</span>
              </>
            )}
            <span className="text-sm text-purple-400 font-medium">{displayLanguage}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {value.split('\n').length} satır
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-[#2c313a] transition-colors relative"
            title="Kopyala"
          >
            {copied ? (
              <FiCheck className="w-4 h-4 text-green-400" />
            ) : (
              <FiCopy className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
            )}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-[#21252b] rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? 'Kopyalandı!' : 'Kopyala'}
            </span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#21252b] border-r border-[#181a1f] flex flex-col items-center py-4 select-none gap-[0.24rem]">
          {value.split('\n').map((_, i) => (
            <div key={i} className="text-xs text-gray-500 leading-[1.5]">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <div className="pl-12">
          <SyntaxHighlighter
            language={language}
            style={codeTheme}
            customStyle={{
              margin: 0,
              padding: '1rem 1.5rem',
              background: 'transparent',
              fontSize: '0.9rem',
              lineHeight: '1.5',
            }}
            showLineNumbers={false}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
} 