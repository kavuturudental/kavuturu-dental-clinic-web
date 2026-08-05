// src/components/doctor/website/RichTextEditor.jsx

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDialog } from "../../../context/DialogContext";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo,
  Redo
} from "lucide-react";

/**
 * Clean pasted HTML content from Word, Google Docs, or web pages
 */
const cleanHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  
  // Remove scripts, styles, meta, link tags
  const removeElements = doc.querySelectorAll("script, style, meta, link, xml");
  removeElements.forEach(el => el.remove());

  // Traverse all elements and remove inline styles/classes except semantic tags
  const allElements = doc.body.querySelectorAll("*");
  allElements.forEach(el => {
    // Strip inline styles and class names
    el.removeAttribute("style");
    el.removeAttribute("class");
    el.removeAttribute("id");
    el.removeAttribute("lang");

    // Convert <span> to plain text node if no attributes
    if (el.tagName.toLowerCase() === "span" || el.tagName.toLowerCase() === "font") {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });

  return doc.body.innerHTML;
};

export default function RichTextEditor({ value, onChange, placeholder = "Write your article using headings, bold, italic, lists, and quotes..." }) {
  const editorRef = useRef(null);
  const { showConfirm, showDialog } = useDialog();

  // Active Formatting States for Toolbar Buttons
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    blockType: "p",
    ul: false,
    ol: false,
    blockquote: false,
    align: "left",
    isLink: false,
  });

  // Sync value into editor innerHTML without breaking cursor focus
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Update Toolbar Active States based on Selection
  const checkActiveStates = useCallback(() => {
    if (!editorRef.current) return;

    try {
      const bold = document.queryCommandState("bold");
      const italic = document.queryCommandState("italic");
      const underline = document.queryCommandState("underline");
      const ul = document.queryCommandState("insertUnorderedList");
      const ol = document.queryCommandState("insertOrderedList");

      let align = "left";
      if (document.queryCommandState("justifyCenter")) align = "center";
      else if (document.queryCommandState("justifyRight")) align = "right";
      else if (document.queryCommandState("justifyFull")) align = "justify";

      // Inspect selection parent nodes for H1, H2, H3, Blockquote, Link
      let blockType = "p";
      let isLink = false;
      let isBlockquote = false;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.getRangeAt(0).startContainer;
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (["h1", "h2", "h3", "p"].includes(tag)) {
              blockType = tag;
            }
            if (tag === "blockquote") {
              isBlockquote = true;
            }
            if (tag === "a") {
              isLink = true;
            }
          }
          node = node.parentNode;
        }
      }

      setActiveStates({
        bold,
        italic,
        underline,
        blockType,
        ul,
        ol,
        blockquote: isBlockquote,
        align,
        isLink,
      });
    } catch (err) {
      // Ignore queryCommandState errors if selection is outside
    }
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkActiveStates);
    return () => {
      document.removeEventListener("selectionchange", checkActiveStates);
    };
  }, [checkActiveStates]);

  const execCmd = (command, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    checkActiveStates();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    checkActiveStates();
  };

  // Robust Block format change handler (P, H1, H2, H3)
  const applyBlockFormat = (formatTag) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const cleanTag = formatTag.toLowerCase().replace(/[<>]/g, "");
    const tagWithAngle = `<${cleanTag}>`;

    try {
      document.execCommand("formatBlock", false, tagWithAngle);
    } catch (err) {
      try {
        document.execCommand("formatBlock", false, cleanTag);
      } catch (e) {
        console.error("formatBlock failed:", e);
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    checkActiveStates();
  };

  // Hyperlink creation/editing handler
  const handleAddLink = async () => {
    let currentUrl = "";
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "a") {
          currentUrl = node.getAttribute("href") || "";
          break;
        }
        node = node.parentNode;
      }
    }

    if (activeStates.isLink && currentUrl) {
      const choice = await showConfirm(
        `Current link target: "${currentUrl}". Would you like to edit the URL or remove the link?`,
        "Edit Link Target",
        "Edit URL",
        "Remove Link"
      );
      if (!choice) {
        execCmd("unlink");
        return;
      }
    }

    const url = await showDialog({
      type: "prompt",
      title: "Insert Hyperlink",
      message: "Enter destination website URL:",
      defaultValue: currentUrl || "https://",
      placeholder: "https://kavuturudental.com",
      confirmText: "Insert Link",
      cancelText: "Cancel"
    });

    if (url && url.trim() && url.trim() !== "https://") {
      execCmd("createLink", url.trim());
    }
  };

  const addLink = handleAddLink;

  // Clean paste handler to strip bad Word / Google Docs styles
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const html = e.clipboardData.getData("text/html");

    if (html) {
      const sanitized = cleanHtml(html);
      document.execCommand("insertHTML", false, sanitized);
    } else if (text) {
      document.execCommand("insertText", false, text);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Keyboard shortcut listener
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        execCmd("bold");
      } else if (key === "i") {
        e.preventDefault();
        execCmd("italic");
      } else if (key === "u") {
        e.preventDefault();
        execCmd("underline");
      } else if (key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          execCmd("redo");
        }
      } else if (key === "y") {
        e.preventDefault();
        execCmd("redo");
      }
    }
  };

  // Prevent button mouse-down from stealing focus from contentEditable canvas
  const preventFocusLoss = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs flex flex-col font-sans">
      
      {/* RICH TEXT CANVAS TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border-b border-slate-200 text-slate-700 select-none shrink-0">
        
        {/* Paragraph / Headings Select Dropdown */}
        <select
          value={activeStates.blockType}
          onChange={(e) => applyBlockFormat(e.target.value)}
          className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer hover:border-slate-300 shadow-2xs"
        >
          <option value="p">Normal Paragraph</option>
          <option value="h1">Heading 1 (H1)</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
        </select>

        {/* Quick Headings Format Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => applyBlockFormat("p")}
            title="Normal Paragraph"
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStates.blockType === "p" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
            }`}
          >
            P
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => applyBlockFormat("h1")}
            title="Heading 1"
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStates.blockType === "h1" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
            }`}
          >
            H1
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => applyBlockFormat("h2")}
            title="Heading 2"
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStates.blockType === "h2" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
            }`}
          >
            H2
          </button>

          <button
            type="button"
            onMouseDown={preventFocusLoss}
            onClick={() => applyBlockFormat("h3")}
            title="Heading 3"
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStates.blockType === "h3" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
            }`}
          >
            H3
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Text Styling */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("bold")}
          title="Bold (Ctrl+B)"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.bold ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("italic")}
          title="Italic (Ctrl+I)"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.italic ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("underline")}
          title="Underline (Ctrl+U)"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.underline ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("justifyLeft")}
          title="Align Left"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.align === "left" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("justifyCenter")}
          title="Align Center"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.align === "center" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("justifyRight")}
          title="Align Right"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.align === "right" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("justifyFull")}
          title="Justify"
          className={`p-1.5 rounded-lg text-slate-700 cursor-pointer transition-all ${
            activeStates.align === "justify" ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200"
          }`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Bullet List & Numbered List */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("insertUnorderedList")}
          title="Bullet List"
          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
            activeStates.ul ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("insertOrderedList")}
          title="Numbered List"
          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
            activeStates.ol ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => applyBlockFormat("blockquote")}
          title="Block Quote"
          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
            activeStates.blockquote ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("insertHorizontalRule")}
          title="Horizontal Divider"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={handleAddLink}
          title={activeStates.isLink ? "Edit / Remove Hyperlink" : "Insert Hyperlink"}
          className={`p-1.5 rounded-lg cursor-pointer transition-all ${
            activeStates.isLink ? "bg-[#0E2A6D] text-white shadow-2xs" : "hover:bg-slate-200 text-slate-700"
          }`}
        >
          {activeStates.isLink ? <Unlink className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("undo")}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => execCmd("redo")}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* FULL CANVAS EDITABLE WRITING AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={checkActiveStates}
        onMouseUp={checkActiveStates}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[360px] max-h-[560px] overflow-y-auto p-6 text-sm text-slate-900 leading-relaxed outline-none focus:bg-slate-50/20 font-sans space-y-3 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mt-6 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:my-3 [&_ul]:pl-2 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:my-3 [&_ol]:pl-2 [&_ol]:space-y-1.5 [&_li]:text-slate-800 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:bg-sky-50/60 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-sky-900 [&_a]:text-sky-600 [&_a]:underline [&_hr]:my-4 [&_hr]:border-slate-200"
      />
    </div>
  );
}
