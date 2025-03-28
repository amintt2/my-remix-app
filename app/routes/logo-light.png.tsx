import fs from 'fs';
import path from 'path';

export function loader() {
  const filePath = path.resolve('./public/logo-light.png');
  const fileBuffer = fs.readFileSync(filePath);
  
  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 