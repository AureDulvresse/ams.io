import { AlertCircle } from "lucide-react";

const ErrorState = ({ message }: { message: string }) => (
   <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <p className="text-lg text-gray-600">{message}</p>
   </div>
);

export default ErrorState;