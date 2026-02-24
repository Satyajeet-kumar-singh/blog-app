import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor({ intialData, onChange }) {
  return (
    <ReactQuill
      theme="snow"
      value={intialData || ""}
      onChange={onChange}
      placeholder="Type or paste your content here!"
      className="bg-white"
    />
  );
}