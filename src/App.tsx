import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";

function App() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onSearch={setKeyword} />
        <ScrollArea className="flex-1 overflow-visible">
          <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full relative">
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  YouTube Analytics
                </h1>
                <p className="text-muted-foreground">
                  Discover and analyze YouTube content with powerful insights
                </p>
              </div>
              <Dashboard keyword={keyword} />
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}

export default App;

// src/App.tsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Layout from "./components/Layout";
// import YoutubePage from "./pages/YoutubePage";
// import NewsPage from "./pages/NewsPage";

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/youtube" replace />} />
//           <Route path="/youtube" element={<YoutubePage />} />
//           <Route path="/news" element={<NewsPage />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;



