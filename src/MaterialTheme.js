import { blueGrey, blue, purple, amber, red, green, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  palette: {
    primary: blue,
    secondary: purple,
    warning: amber,
    success: green,
    basic: blueGrey,
    error: red,
    info: indigo,
  }
});