"use client";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { verifyTokenByToken } from "@/src/data/verification-token";
import { CheckCircleIcon, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface VerificationEmailPageProps {
  params: {
    token: string;
  };
}

const VerificationEmailPage = ({ params }: VerificationEmailPageProps) => {
  const router = useRouter();
  const { token } = params;

  const handleValidateToken = async (token: string) => await verifyTokenByToken(token);
  const validateToken = handleValidateToken(token);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="p-6 shadow-xl bg-white/50 backdrop-blur-sm border-0">
        {validateToken != null ? (
          <CardContent>
            <CheckCircleIcon
              size={68}
              className="text-primary text-center mb-4"
            />
            <p className="text-2xl">Votre adresse e-mail a été validée</p>
            <p className="text-muted-foreground mb-3">
              Vous pouvez maintenant vous connecter
            </p>

            <Button
              className="bg-primary hover:bg-primary"
              onClick={() => router.push("/login")}
            >
              Me connecter
            </Button>
          </CardContent>
        ) : (
          <CardContent>
            <XCircle size={68} className="text-red-500 text-center mb-4" />
            <p className="text-2xl">Votre adresse e-mail n'a pas été validée</p>
            <p className="text-muted-foreground mb-3">Token invalide</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default VerificationEmailPage;
