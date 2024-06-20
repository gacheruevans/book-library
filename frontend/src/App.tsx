import Searchbar from "./components/SearchBar";
import ReadingList from "./components/ReadingList";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './App.css';

const THEME = createTheme({
   typography: {
    "fontFamily": `"Mulish"`,
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
   }
});

export default function App() {
  return (
    <ThemeProvider theme={THEME}>
      <div className="App">
        <div className="readinglist"><ReadingList /></div>
        <div className="search"><Searchbar /></div>
      </div>
    </ThemeProvider>
  );
}


