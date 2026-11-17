import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode } from "../../components/admin-template/theme";
import DashboardView from "../../components/admin-template/scenes/dashboard";

/**
 * Dashboard visuel du template React Admin, intégré à Alliance Transit.
 * Le layout général (sidebar/navigation/auth) reste géré par AdminLayout.jsx.
 */
export default function DashboardPage() {
  const [theme] = useMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardView />
    </ThemeProvider>
  );
}
