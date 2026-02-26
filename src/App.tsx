import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-brand-700 p-8">
          Geriatric Home Care System
        </h1>
      </div>
    </QueryClientProvider>
  );
}

export default App;
