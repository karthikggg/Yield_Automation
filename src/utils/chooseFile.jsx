import { useRef, useState } from "react";

const FilePicker = ({ accept = "*", onChange }) => {
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);  // ← add this

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    onChange?.(file);
  };
    const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setFileName(file.name);
    onChange?.(file);
  };
  

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}   // ← add
      onDragLeave={() => setDragging(false)}
      className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl px-5 py-4 w-fit transition-colors"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Icon */}
      <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0L8 8m4-4l4 4" />
      </svg>

      <span className="text-sm text-gray-600">
        {fileName ?? "Choose a file"}
      </span>

      {fileName && (
        <span
          onClick={(e) => { e.stopPropagation(); setFileName(null); onChange?.(null); }}
          className="ml-2 text-gray-400 hover:text-red-500 text-lg leading-none"
        >
          ×
        </span>
      )}
    </div>
  );
};

export default FilePicker;