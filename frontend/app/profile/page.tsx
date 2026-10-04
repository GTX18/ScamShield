import RequireAuth from "@/components/RequireAuth";
import ProfileView from "@/components/ProfileView";
export const metadata = { title: "Profile — ScamShield" };
export default function Page() { return <RequireAuth><ProfileView /></RequireAuth>; }
