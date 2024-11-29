import { NextResponse } from 'next/server';
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  useTLS: true,
});

export async function POST(request: Request) {
    try {
    const { message, conversationId } = await request.json();

    // Émettre l'événement à Pusher
    await pusher.trigger("chat-channel", "new-message", {
      message,
      conversationId,
    });

        // Retour de la réponse avec succès
        return NextResponse.json("Message envoyé", { status: 201 });
    } catch (error: any) {
        console.error('Erreur lors de la création de l\'étudiant:', error);

        // // Gestion des erreurs Prisma
        // if (error instanceof PrismaClientKnownRequestError) {
        //   // Gérer les erreurs connues de Prisma
        //   return NextResponse.json(
        //     { message: "Une erreur Prisma s'est produite : " + error.message },
        //     { status: 400 }
        //   );
        // }

        // Gestion des erreurs de validation (par exemple, des champs manquants ou mal formés)
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: "Erreur de validation : " + error.message },
                { status: 422 }
            );
        }

        // Gestion des erreurs inattendues
        return NextResponse.json(
            { message: "Une erreur inattendue s'est produite." },
            { status: 500 }
        );
    }
 
}
