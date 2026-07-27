import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {appendRefUrl} from '../lib/apps';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    justify?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
                                                                      content,
                                                                      className = '',
                                                                      justify = true,
                                                                  }) => {
    return (
        <div className={`prose prose-invert max-w-none font-mono ${justify ? 'text-justify' : ''} ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    p: ({node, children, ...props}) => (
                        <p className={`text-sm font-mono font-normal text-zinc-300 leading-relaxed my-2.5 ${justify ? 'text-justify' : ''}`} {...props}>
                            {children}
                        </p>
                    ),
                    h1: ({node, children, ...props}) => (
                        <h1 className="text-xl font-mono font-bold text-white mt-6 mb-3 border-b border-[#262626] pb-2 text-left" {...props}>
                            {children}
                        </h1>
                    ),
                    h2: ({node, children, ...props}) => (
                        <h2 className="text-lg font-mono font-bold text-white mt-5 mb-2.5 border-b border-[#262626]/60 pb-1 text-left" {...props}>
                            {children}
                        </h2>
                    ),
                    h3: ({node, children, ...props}) => (
                        <h3 className="text-base font-mono font-semibold text-white mt-4 mb-2 text-left" {...props}>
                            {children}
                        </h3>
                    ),
                    h4: ({node, children, ...props}) => (
                        <h4 className="text-sm font-mono font-semibold text-zinc-100 mt-3 mb-1.5 text-left" {...props}>
                            {children}
                        </h4>
                    ),
                    h5: ({node, children, ...props}) => (
                        <h5 className="text-xs font-mono font-semibold text-zinc-200 mt-2 mb-1 uppercase tracking-wider text-left" {...props}>
                            {children}
                        </h5>
                    ),
                    h6: ({node, children, ...props}) => (
                        <h6 className="text-xs font-mono font-semibold text-zinc-400 mt-2 mb-1 text-left" {...props}>
                            {children}
                        </h6>
                    ),
                    ul: ({node, children, ...props}) => (
                        <ul className="list-disc list-outside ml-5 my-3 space-y-1 text-sm font-sans text-zinc-300" {...props}>
                            {children}
                        </ul>
                    ),
                    ol: ({node, children, ...props}) => (
                        <ol className="list-decimal list-outside ml-5 my-3 space-y-1 text-sm font-sans text-zinc-300" {...props}>
                            {children}
                        </ol>
                    ),
                    li: ({node, children, ...props}) => (
                        <li className={`leading-relaxed pl-1 ${justify ? 'text-justify' : ''}`} {...props}>
                            {children}
                        </li>
                    ),
                    a: ({node, children, href, ...props}) => (
                        <a
                            {...props}
                            href={appendRefUrl(href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 underline decoration-red-500/50 hover:decoration-red-400 hover:text-red-300 transition-colors font-medium"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({node, children, ...props}) => (
                        <strong className="font-semibold text-white" {...props}>
                            {children}
                        </strong>
                    ),
                    em: ({node, children, ...props}) => (
                        <em className="italic text-zinc-200" {...props}>
                            {children}
                        </em>
                    ),
                    blockquote: ({node, children, ...props}) => (
                        <blockquote
                            className="border-l-2 border-red-500/80 pl-4 py-1 my-3 text-zinc-400 italic bg-[#121212]/60 rounded-r text-justify" {...props}>
                            {children}
                        </blockquote>
                    ),
                    code: ({node, inline, className, children, ...props}: any) => {
                        if (inline) {
                            return (
                                <code
                                    className="font-mono text-xs text-red-300 bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#262626]" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className="font-mono text-xs text-zinc-200" {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({node, children, ...props}) => (
                        <pre
                            className="font-mono text-xs text-zinc-200 bg-[#0F0F0F] p-3.5 rounded-lg border border-[#262626] overflow-x-auto my-3" {...props}>
                            {children}
                        </pre>
                    ),
                    hr: ({node, ...props}) => (
                        <hr className="my-6 border-[#262626]" {...props} />
                    ),
                    table: ({node, children, ...props}) => (
                        <div className="overflow-x-auto my-4">
                            <table
                                className="w-full text-left text-xs font-mono border-collapse border border-[#262626]" {...props}>
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({node, children, ...props}) => (
                        <thead className="bg-[#141414] text-zinc-200" {...props}>
                        {children}
                        </thead>
                    ),
                    tbody: ({node, children, ...props}) => (
                        <tbody className="divide-y divide-[#262626]" {...props}>
                        {children}
                        </tbody>
                    ),
                    tr: ({node, children, ...props}) => (
                        <tr className="hover:bg-[#121212]" {...props}>
                            {children}
                        </tr>
                    ),
                    th: ({node, children, ...props}) => (
                        <th className="p-2.5 border border-[#262626] font-semibold text-white" {...props}>
                            {children}
                        </th>
                    ),
                    td: ({node, children, ...props}) => (
                        <td className="p-2.5 border border-[#262626] text-zinc-300" {...props}>
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
