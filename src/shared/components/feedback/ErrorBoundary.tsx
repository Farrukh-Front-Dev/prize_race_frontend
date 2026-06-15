import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-surface">
          <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Something went wrong</h2>
          <p className="text-sm text-on-surface-variant max-w-xs mb-6">
            {this.state.error?.message || "An unexpected error occurred in the front-end application."}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
