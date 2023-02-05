// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ThemeSettings from "./components/settings";
import "./style.css";

function App() {
  return (
    <ThemeProvider>
      <ThemeSettings>
        {" "}
        <Router />{" "}
      </ThemeSettings>
    </ThemeProvider>
  );
}

export default App;
