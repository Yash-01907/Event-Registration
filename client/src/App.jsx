import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/shared/Navbar";
import Landing from "@/pages/Landing";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/events"
                element={
                  <div className="pt-20 text-center">
                    Events Page (Coming Soon)
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="pt-20 text-center">
                    Login Page (Coming Soon)
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
