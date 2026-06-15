import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { queryClient } from "../shared/lib/queryClient";
import ErrorBoundary from "../shared/components/feedback/ErrorBoundary";
import ToastContainer from "../shared/components/feedback/ToastContainer";

interface ProvidersProps {
  children: ReactNode;
}

// Relies on a standard decentralized ton-community developer manifest
const manifestUrl =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
        </QueryClientProvider>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
}
export default Providers;
