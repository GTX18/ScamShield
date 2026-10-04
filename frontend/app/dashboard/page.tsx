import RequireAuth from "@/components/RequireAuth";
import DashboardView from "@/components/DashboardView";
export const metadata = { title: "Dashboard — ScamShield" };
export default function Page() { return <RequireAuth><DashboardView /></RequireAuth>; }
