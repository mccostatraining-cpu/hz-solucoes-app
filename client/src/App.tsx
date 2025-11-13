import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import AddRevenue from "./pages/AddRevenue";
import Items from "./pages/Items";
import FixedExpenses from "./pages/FixedExpenses";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import Cards from "./pages/Cards";
import CardPurchases from "./pages/CardPurchases";
import Debts from "./pages/Debts";
import Limits from "./pages/Limits";
import Dues from "./pages/Dues";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/add-expense"} component={AddExpense} />
      <Route path={"/add-revenue"} component={AddRevenue} />
      <Route path={"/items"} component={Items} />
      <Route path={"/fixed-expenses"} component={FixedExpenses} />
      <Route path={"/projects"} component={Projects} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/cards"} component={Cards} />
      <Route path={"/purchases"} component={CardPurchases} />
      <Route path={"/debts"} component={Debts} />
      <Route path={"/limits"} component={Limits} />
      <Route path={"/dues"} component={Dues} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
