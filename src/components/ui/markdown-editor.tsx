'use client';

import MDEditor, { commands } from '@uiw/react-md-editor';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    height?: number;
}

export default function MarkdownEditor({ value, onChange, height = 300 }: MarkdownEditorProps) {
    return (
        <div data-color-mode="light">
            <MDEditor
                value={value}
                onChange={onChange}
                height={height}
                previewOptions={{
                    remarkPlugins: [remarkGfm, remarkBreaks],
                    rehypePlugins: [rehypeRaw]
                }}
                commands={[
                    commands.bold,
                    commands.italic,
                    commands.divider,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                ]}
                extraCommands={[]}
            />
        </div>
    );
}
