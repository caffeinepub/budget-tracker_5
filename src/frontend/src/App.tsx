import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GSPackersPage from "./pages/GSPackersPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GSPackersPage />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
