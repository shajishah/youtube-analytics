import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/MobileNav";
import { useState } from "react";
import { Search, Bell, User, Filter, TrendingUp } from "lucide-react";

const keywords = [
  { value: "React JS", label: "React JS", category: "Frontend", icon: "⚛️" },
  { value: "Next.js", label: "Next.js", category: "Frontend", icon: "▲" },
  { value: "Node.js", label: "Node.js", category: "Backend", icon: "🟢" },
  { value: "Machine Learning", label: "Machine Learning", category: "AI/ML", icon: "🤖" },
  { value: "JavaScript", label: "JavaScript", category: "Language", icon: "🟨" },
  { value: "TypeScript", label: "TypeScript", category: "Language", icon: "🔷" },
  { value: "Python", label: "Python", category: "Language", icon: "🐍" },
  { value: "AI Tutorial", label: "AI Tutorial", category: "AI/ML", icon: "🧠" },
  { value: "Web Development", label: "Web Development", category: "General", icon: "🌐" },
  { value: "Data Science", label: "Data Science", category: "Data", icon: "📊" },
];

const trendingKeywords = ["AI", "React 19", "TypeScript", "Next.js 14"];

export function Topbar({ onSearch }: { onSearch: (keyword: string) => void }) {
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [customKeyword, setCustomKeyword] = useState("");
  const [searchMode, setSearchMode] = useState<"select" | "custom">("select");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchMode === "custom" ? customKeyword : selectedKeyword;
    if (keyword.trim()) {
      onSearch(keyword);
    }
  };

  const handleTrendingClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    setSearchMode("select");
    onSearch(keyword);
  };

  const handleKeywordSelect = (value: string) => {
    setSelectedKeyword(value);
    onSearch(value);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 overflow-visible">
      <div className="flex items-center justify-between p-4 lg:p-6 relative">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        
        {/* Search Section */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Mode Toggle */}
              <div className="flex rounded-lg border bg-background p-1">
                <Button
                  type="button"
                  variant={searchMode === "select" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSearchMode("select")}
                  className="h-7 px-3 text-xs"
                  aria-label="Use preset search terms"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Preset
                </Button>
                <Button
                  type="button"
                  variant={searchMode === "custom" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSearchMode("custom")}
                  className="h-7 px-3 text-xs"
                  aria-label="Enter custom search term"
                >
                  <Search className="w-3 h-3 mr-1" />
                  Custom
                </Button>
              </div>

              {/* Search Input/Select */}
              {searchMode === "custom" ? (
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter custom search term..."
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      className="pl-10 h-10"
                      aria-label="Custom search term"
                    />
                  </div>
                  <Button type="submit" disabled={!customKeyword.trim()} className="h-10 px-6">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex gap-2">
                  <Select
                    value={selectedKeyword}
                    onValueChange={handleKeywordSelect}
                  >
                    <SelectTrigger className="flex-1 h-10 bg-background border-border hover:border-primary/50 focus:border-primary transition-colors pl-10">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Choose a topic to explore..." />
                    </SelectTrigger>
                    <SelectContent 
                      className="max-h-80 w-full min-w-[300px] z-50" 
                      position="popper"
                      sideOffset={4}
                    >
                      <SelectGroup>
                        {/* Frontend Technologies */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Frontend Technologies
                        </div>
                        {keywords.filter(kw => kw.category === "Frontend").map((kw) => (
                          <SelectItem 
                            key={kw.value} 
                            value={kw.value}
                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent"
                          >
                            <span className="text-lg">{kw.icon}</span>
                            <span className="font-medium">{kw.label}</span>
                          </SelectItem>
                        ))}
                        
                        {/* Backend Technologies */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                          Backend Technologies
                        </div>
                        {keywords.filter(kw => kw.category === "Backend").map((kw) => (
                          <SelectItem 
                            key={kw.value} 
                            value={kw.value}
                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent"
                          >
                            <span className="text-lg">{kw.icon}</span>
                            <span className="font-medium">{kw.label}</span>
                          </SelectItem>
                        ))}
                        
                        {/* Programming Languages */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                          Programming Languages
                        </div>
                        {keywords.filter(kw => kw.category === "Language").map((kw) => (
                          <SelectItem 
                            key={kw.value} 
                            value={kw.value}
                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent"
                          >
                            <span className="text-lg">{kw.icon}</span>
                            <span className="font-medium">{kw.label}</span>
                          </SelectItem>
                        ))}
                        
                        {/* AI & Machine Learning */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                          AI & Machine Learning
                        </div>
                        {keywords.filter(kw => kw.category === "AI/ML").map((kw) => (
                          <SelectItem 
                            key={kw.value} 
                            value={kw.value}
                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent"
                          >
                            <span className="text-lg">{kw.icon}</span>
                            <span className="font-medium">{kw.label}</span>
                          </SelectItem>
                        ))}
                        
                        {/* Data & Analytics */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                          Data & Analytics
                        </div>
                        {keywords.filter(kw => kw.category === "Data").map((kw) => (
                          <SelectItem 
                            key={kw.value} 
                            value={kw.value}
                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent"
                          >
                            <span className="text-lg">{kw.icon}</span>
                            <span className="font-medium">{kw.label}</span>
                          </SelectItem>
                        ))}
                        
                        {/* General */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                          General
                        </div>
                        {keywords.filter(kw => kw.category === "General").map((kw) => (
                          <SelectItem 
                            key={kw.value} 
                            value={kw.value}
                            className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-accent focus:bg-accent"
                          >
                            <span className="text-lg">{kw.icon}</span>
                            <span className="font-medium">{kw.label}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button type="submit" disabled={!selectedKeyword} className="h-10 px-6">
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              )}
            </div>

            {/* Trending Keywords */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>Trending:</span>
              </div>
              {trendingKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 font-medium px-2.5 py-1"
                  onClick={() => handleTrendingClick(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 ml-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="w-4 h-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
