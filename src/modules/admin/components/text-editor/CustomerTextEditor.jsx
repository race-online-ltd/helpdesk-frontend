


import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaQuoteRight,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLink,
  FaTable,
} from 'react-icons/fa';

// ✅ emptyDoc এখন empty string
const emptyDoc = '';

const CustomerTextEditor = ({ name, value, onChange, onBlur, placeholder }) => {
  const [inited, setInited] = useState(false);

  const isEmpty =
  !value ||
  value === '<p></p>' ||
  value === '<p><br></p>';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder,emptyEditorClass: 'is-editor-empty', }),
    ],
    // content: value || emptyDoc,
    content: isEmpty ? '' : value,
    // ✅ getJSON() থেকে getHTML() তে change করা হয়েছে
    onUpdate: ({ editor }) => onChange?.({ target: { name, value: editor.getHTML() } }),
    onBlur: () => onBlur?.({ target: { name } }),
  });

  // useEffect(() => {
  //   if (!editor) return;
  //   const safeValue = value || emptyDoc;
  //   // ✅ JSON compare থেকে string compare তে change করা হয়েছে
  //   if (editor.getHTML() !== safeValue) {
  //     editor.commands.setContent(safeValue, false);
  //   }
  //   setInited(true);
  // }, [value, editor]);
  useEffect(() => {
  if (!editor) return;

  const isEmpty =
    !value ||
    value === '<p></p>' ||
    value === '<p><br></p>';

  const safeValue = isEmpty ? '' : value;

  if (editor.getHTML() !== safeValue) {
    editor.commands.setContent(safeValue, false);
  }

  setInited(true);
}, [value, editor]);



  // ✅ Table insert/remove toggle
  const handleTableToggle = () => {
    if (!editor) return;
    const { state } = editor;
    const { from } = state.selection;
    let insideTable = false;

    state.doc.nodesBetween(from, from, (node) => {
      if (node.type.name === 'table') insideTable = true;
    });

    if (insideTable) {
      editor.chain().focus().deleteTable().run();
    } else {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  if (!editor || !inited) return null;

  return (
    <div className="border rounded bg-white flex-grow-1">
      {/* Toolbar */}
      <div className="rte-toolbar d-flex flex-wrap gap-1 border-bottom p-2 bg-light">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <FaBold />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FaItalic />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FaUnderline />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FaQuoteRight />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <FaAlignLeft />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <FaAlignCenter />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <FaAlignRight />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            const url = prompt('Enter URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <FaLink />
        </ToolbarButton>

        {/* Table Toggle Button */}
        <ToolbarButton onClick={handleTableToggle}>
          <FaTable />
        </ToolbarButton>

        {/* Color */}
        <label
          title="Text Color"
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 30,
            height: 30,
            borderRadius: 4,
            cursor: 'pointer',
            border: '1px solid #cbd5e0',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 'bold', pointerEvents: 'none' }}>T</span>
          <input
            type="color"
            style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>

        {/* Highlight */}
        <label
          title="Highlight Color"
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 30,
            height: 30,
            borderRadius: 4,
            cursor: 'pointer',
            border: '1px solid #cbd5e0',
            overflow: 'hidden',
            padding: 0,
            background: '#fef08a',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 'bold', pointerEvents: 'none' }}>H</span>
          <input
            type="color"
            style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
            onChange={(e) =>
              editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
            }
          />
        </label>
      </div>

      {/* Editor */}
      {/* <div className="p-3">
        <EditorContent editor={editor} />
      </div> */}

      <div className="p-3 position-relative">
  {(!value || value === '<p></p>' || value === '<p><br></p>') && (
    <span
      style={{
        position: 'absolute',
        left: '16px',
        top: '12px',
        color: '#adb5bd',
        pointerEvents: 'none',
      }}
    >
      {placeholder}
    </span>
  )}

  <EditorContent editor={editor} />
</div>

      <style>{`
        .ProseMirror {
          min-height: 150px;
          outline: none;
          white-space: pre-wrap;
          width: 100%;
          box-sizing: border-box;
          overflow-x: auto;
          word-break: break-word;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #0d6efd;
          margin: 8px 0;
          padding: 8px 16px;
          background-color: #f8f9fa;
          color: #495057;
          border-radius: 0 4px 4px 0;
          font-style: italic;
        }
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
          table-layout: fixed;
          overflow: hidden;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #ced4da;
          padding: 6px 10px;
          min-width: 80px;
          vertical-align: top;
          position: relative;
        }
        .ProseMirror table th {
          background-color: #f8f9fa;
          font-weight: bold;
          text-align: left;
        }
        .ProseMirror table .selectedCell:after {
          background: rgba(13, 110, 253, 0.15);
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
        .rte-toolbar .btn {
          padding: 4px 8px;
          line-height: 1;
        }
        .rte-toolbar label {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

const ToolbarButton = ({ children, onClick }) => (
  <button type="button" onClick={onClick} className="btn btn-sm btn-outline-secondary">
    {children}
  </button>
);

export default CustomerTextEditor;
