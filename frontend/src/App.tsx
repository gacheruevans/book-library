import Searchbar from "./components/SearchBar";
import ReadingList from "./components/ReadingList";

import './App.css';

export default function App() {
  return (
    <div className="App">
        <div className="readinglist"><ReadingList /></div>
        <div className="search"><Searchbar /></div>
    </div>
  );
}


