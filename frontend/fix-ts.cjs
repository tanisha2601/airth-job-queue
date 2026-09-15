const fs = require('fs');
const path = require('path');

const files = [
  'src/App.tsx',
  'src/components/CreateJobModal.tsx',
  'src/components/JobRow.tsx',
  'src/components/JobTable.tsx',
  'src/components/StatusBadge.tsx',
  'src/components/StatusFilter.tsx',
  'src/components/SummaryCards.tsx',
  'src/pages/Dashboard.tsx',
  'src/services/jobsApi.ts'
];

files.forEach(f => {
  let content = fs.readFileSync(path.join(__dirname, f), 'utf8');
  
  // Fix verbatim module syntax
  content = content.replace(/import \{([^}]+)\}\s+from\s+'\.\.\/types\/job';/g, "import type { $1 } from '../types/job';");
  
  // Remove React import if unused (App.tsx)
  if (f === 'src/App.tsx') {
    content = content.replace(/import React from 'react';\n/g, "");
  }

  // Fix erasable syntax in ApiError class
  if (f === 'src/services/jobsApi.ts') {
    content = content.replace(/export class ApiError extends Error {\n  constructor\(public status: number, message: string\) {\n    super\(message\);\n    this\.name = 'ApiError';\n  }\n}/, 
    "export class ApiError extends Error {\n  status: number;\n  constructor(status: number, message: string) {\n    super(message);\n    this.name = 'ApiError';\n    this.status = status;\n  }\n}");
  }

  fs.writeFileSync(path.join(__dirname, f), content);
});
