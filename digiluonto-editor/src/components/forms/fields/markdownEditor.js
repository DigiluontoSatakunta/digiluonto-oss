import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

export default function MarkDownEditor({value, onChange}) {
  return (
    <MDEditor
      fullscreen={false}
      height="400"
      value={value}
      onChange={onChange}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      textareaProps={{
        placeholder: "Lisää sisältö tähän...",
      }}
    />
  );
}
