"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`min-w-8 rounded px-2 py-1 text-sm transition ${
        active
          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
          : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback(
    async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        alert("Tải ảnh thất bại");
        return;
      }
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    },
    [editor],
  );

  const addLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL liên kết:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
      <ToolbarButton title="Đậm" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton title="Nghiêng" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton title="Gạch ngang" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton title="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        {"</>"}
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-600" />
      <ToolbarButton title="Tiêu đề 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton title="Tiêu đề 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton title="Danh sách" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolbarButton>
      <ToolbarButton title="Danh sách số" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolbarButton>
      <ToolbarButton title="Trích dẫn" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </ToolbarButton>
      <ToolbarButton title="Khối code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        {"{ }"}
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-600" />
      <ToolbarButton title="Liên kết" active={editor.isActive("link")} onClick={addLink}>
        🔗
      </ToolbarButton>
      <ToolbarButton title="Chèn ảnh" onClick={() => fileInput.current?.click()}>
        🖼️
      </ToolbarButton>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />
      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-600" />
      <ToolbarButton title="Hoàn tác" onClick={() => editor.chain().focus().undo().run()}>
        ↺
      </ToolbarButton>
      <ToolbarButton title="Làm lại" onClick={() => editor.chain().focus().redo().run()}>
        ↻
      </ToolbarButton>
    </div>
  );
}

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Viết nội dung bài viết ở đây…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[380px] rounded-lg border border-neutral-200 dark:border-neutral-700" />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
