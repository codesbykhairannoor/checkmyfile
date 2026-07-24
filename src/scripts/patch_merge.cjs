const fs = require('fs');
let code = fs.readFileSync('src/components/tools/MergeWorkspace.tsx', 'utf8');

// 1. interface
code = code.replace(
  'interface MergeWorkspaceProps {\n  files: File[];\n  setFiles: React.Dispatch<React.SetStateAction<File[]>>;\n}',
  'interface MergeWorkspaceProps {\n  files: File[];\n  setFiles: React.Dispatch<React.SetStateAction<File[]>>;\n  tUi?: Record<string, string>;\n}'
);

// 2. Component def
code = code.replace(
  'export const MergeWorkspace: React.FC<MergeWorkspaceProps> = ({ files, setFiles }) => {',
  'export const MergeWorkspace: React.FC<MergeWorkspaceProps> = ({ files, setFiles, tUi = {} }) => {'
);

// 3. Add More
code = code.replace(
  'Add \nMore</span>',
  '{tUi["Add More"] || "Add More"}</span>'
);
code = code.replace(
  '>Add More<',
  '>{tUi["Add More"] || "Add More"}<'
);

fs.writeFileSync('src/components/tools/MergeWorkspace.tsx', code);
console.log('Fixed MergeWorkspace.tsx');
