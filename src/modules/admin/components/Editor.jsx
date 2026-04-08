import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autosave,
  BalloonToolbar,
  Bold,
  Code,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Highlight,
  Italic,
  Paragraph,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
  Table,
  TableToolbar,
  TableCellProperties,
  TableCellPropertiesEditing,
  TableProperties,
  TablePropertiesEditing,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const editorConfig = {
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "highlight",
      "|",
      "insertTable",
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
    // shouldNotGroupWhenFull: true,
  },

  plugins: [
    AccessibilityHelp,
    Autosave,
    BalloonToolbar,
    Bold,
    Code,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Highlight,
    Italic,
    Paragraph,
    RemoveFormat,
    SelectAll,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
    Undo,
    Table,
    TableToolbar,
    TableCellProperties,
    TableCellPropertiesEditing,
    TableProperties,
    TablePropertiesEditing,
  ],
  balloonToolbar: [
    "bold",
    "italic",
    "insertTable",
    "tableColumn",
    "tableRow",
    "mergeTableCells",
    "tableProperties",
    "tableCellProperties",
  ],
  fontFamily: {
    supportAllValues: true,
  },
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22],
    supportAllValues: true,
  },
  initialData: "",
  menuBar: {
    isVisible: true,
  },
  placeholder: "Write your description..",
};

export const Editor = () => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfig}
      // onReady={handleReady}
      onChange={(event, editor) => {
        const data = editor.getData();
        // setEditorContent(data);
        console.log(data);
      }}
    />
  );
};
