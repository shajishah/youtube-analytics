// src/pages/YoutubePage.tsx
import { useState } from "react";
import { Topbar } from "../components/Topbar";
import Dashboard from "../components/Dashboard";

export default function YoutubePage() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex flex-col flex-1">
      <Topbar onSearch={setKeyword} />
      <main className="p-6 overflow-y-auto bg-gray-50">
        <Dashboard keyword={keyword} />
      </main>
    </div>
  );
}
