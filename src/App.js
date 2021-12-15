import './App.css';
import { defaultTheme } from './MaterialTheme';
import { ThemeProvider } from '@mui/material/styles';
import Main from './Pages/Main';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Main />
    </ThemeProvider>
  );
}

export default App;
