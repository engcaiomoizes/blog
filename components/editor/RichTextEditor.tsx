'use client';

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import MenuBar from "./menu-bar";

interface Props {
    initialContent: string;
    onUpdate: (content: string) => void;
}

const RichTextEditor = ({ initialContent, onUpdate }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-3",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-3",
                    }
                }
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            Image,
            ImageResize.configure({ inline: false }),
        ],
        content: initialContent || '<p></p>',
        editorProps: {
            attributes: {
                class: "min-h-[220px] border rounded-md bg-slate-50 dark:bg-gray-800 py-2 px-3"
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdate(html);
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && initialContent)
            editor.commands.setContent(initialContent);
    }, [editor, initialContent]);

    const addImage = () => {
        const url = window.prompt("URL da imagem:");
        if (url)
            editor?.chain().focus().setImage({ src: url }).run();
    };

    if (!editor) return <div>Carregando editor...</div>;

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor;