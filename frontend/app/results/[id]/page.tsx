import RequireAuth from "@/components/RequireAuth";
import ResultPage from "@/components/ResultPage";
export const metadata = { title: "Result — ScamShield" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequireAuth><ResultPage id={Number(id)} /></RequireAuth>;
}
