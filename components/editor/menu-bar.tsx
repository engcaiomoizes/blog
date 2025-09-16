import React from "react";
import { Editor } from "@tiptap/react";
import {
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaAlignJustify,
    FaBold,
    FaItalic,
    FaListOl,
    FaListUl,
    FaStrikethrough,
    FaHighlighter,
    FaImage
} from "react-icons/fa";
import {
    LuHeading1,
    LuHeading2,
    LuHeading3
} from "react-icons/lu";
import { Toggle } from "../ui/toggle";

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null
    }

    const getOptions = () => [
        {
            icon: <LuHeading1 className="size-4" />,
            onClick: () => editor.chain().focus().setNode('heading', { level: 1 }),
            pressed: editor.isActive("heading", { level: 1 }),
        },
        {
            icon: <LuHeading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive("heading", { level: 2 }),
        },
        {
            icon: <LuHeading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive("heading", { level: 3 }),
        },
        {
            icon: <FaBold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive("bold"),
        },
        {
            icon: <FaItalic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive("italic"),
        },
        {
            icon: <FaStrikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive("strike"),
        },
        {
            icon: <FaAlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: editor.isActive({ TextAlign: "left" }),
        },
        {
            icon: <FaAlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: editor.isActive({ TextAlign: "center" }),
        },
        {
            icon: <FaAlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: editor.isActive({ TextAlign: "right" }),
        },
        {
            icon: <FaAlignJustify className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("justify").run(),
            pressed: editor.isActive({ TextAlign: "justify" }),
        },
        {
            icon: <FaListUl className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive("bulletList"),
        },
        {
            icon: <FaListOl className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive("orderedList"),
        },
        {
            icon: <FaHighlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            pressed: editor.isActive("highlight"),
        },
        {
            icon: <FaImage className="size-4" />,
            onClick: () => {
                const url = window.prompt("URL da imagem:");
                if (url)
                    editor.chain().focus().setImage({ src: url }).run();
            },
            pressed: editor.isActive("image"),
        }
    ];

    const options = getOptions();
    
    return (
        <div className="border rounded-md p-1 mb-1 bg-slate-50 dark:bg-gray-800 space-x-2 z-50">
            {
                options.map((option, index) => (
                    <Toggle key={index} pressed={option.pressed} onPressedChange={option.onClick}>
                        {option.icon}
                    </Toggle>
                ))
            }
        </div>
    )
}