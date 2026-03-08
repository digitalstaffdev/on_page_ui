"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const loading = status === "loading";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OP</span>
              </div>
              <span className="font-semibold text-lg">On-Page Agent</span>
            </a>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </a>
                  <a href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    Settings
                  </a>
                  {user.isAdmin && (
                    <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                      Admin
                    </a>
                  )}
                  <a href="/new" className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    + New Analysis
                  </a>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border hover:bg-muted transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {(user.name || user.email)[0].toUpperCase()}
                      </span>
                      <span className="hidden sm:inline max-w-[120px] truncate">{user.name || user.email}</span>
                      <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <a href="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                          Profile & Password
                        </a>
                        <a href="/profile/api-keys" className="block px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                          My API Keys
                        </a>
                        {user.isAdmin && (
                          <a href="/admin" className="block px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setMenuOpen(false)}>
                            Administration
                          </a>
                        )}
                        <div className="border-t">
                          <button
                            onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/login" }); }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                !loading && (
                  <a href="/login" className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Sign In
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t bg-white/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">OP</span>
              </div>
              <span className="text-sm text-muted-foreground">On-Page Optimization Agent</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
