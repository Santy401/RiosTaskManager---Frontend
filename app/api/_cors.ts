export function setCorsHeaders(response: { headers: { set: (arg0: string, arg1: string) => void; }; }) {
  response.headers.set("Access-Control-Allow-Origin", "https://riosbackendtask.vercel.app, https://riosbackendtask.vercel.app/ui/pages/Login/, http://localhost:3000/ui/pages/Login/" );
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
