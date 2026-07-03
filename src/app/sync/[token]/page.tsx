import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SyncFlow } from "@/components/sync-flow";

export const dynamic = "force-dynamic";

export default async function SyncPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const progreso = await prisma.progreso.findFirst({
    where: {
      syncToken: token,
      syncExpiresAt: { gt: new Date() },
      completadoAt: null,
    },
    include: { juego: { select: { nombre: true, lobulo: true, lobuloImg: true } } },
  });

  if (!progreso) {
    redirect("/?error=token-invalido");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <SyncFlow
        token={token}
        juegoNombre={progreso.juego.nombre}
        lobulo={progreso.juego.lobulo}
        lobuloImg={progreso.juego.lobuloImg}
      />
    </div>
  );
}
