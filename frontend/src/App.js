import { useEffect, useState } from "react";
import { Entries } from "./Entries";
import { LoadingSpinner } from "./LoadingSpinner";
import "./App.css";
import { SignInForm } from "./SignIn";
import { NewEntryForm } from "./NewEntryForm";

export const PAGES = {
  SIGNED_OUT: "SIGNED_OUT",
  SIGNED_IN: "SIGNED_IN",
  LOADING: "LOADING",
  NEW_ENTRY: "NEW_ENTRY",
};

function App() {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("user_id") ? PAGES.SIGNED_IN : PAGES.SIGNED_OUT
  );

  useEffect(() => {
    if (localStorage.getItem("user_id")) {
      setCurrentPage(PAGES.SIGNED_IN);
    } else {
      setCurrentPage(PAGES.SIGNED_OUT);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/shining-star-clipart.png"
          alt="Shining star logo"
          className="header-logo"
        />
        <h1>S.T.A.R. Journal</h1>
        <div className="hole hole-1"></div>
        <div className="hole hole-2"></div>
        <div className="hole hole-3"></div>
      </header>
      <main>
        {currentPage === PAGES.SIGNED_OUT && (
          <SignInForm setCurrentPage={setCurrentPage} />
        )}
        {currentPage === PAGES.SIGNED_IN && <Entries setCurrentPage={setCurrentPage} />}
        {currentPage === PAGES.LOADING && <LoadingSpinner />}
        {currentPage === PAGES.NEW_ENTRY && <NewEntryForm setCurrentPage={setCurrentPage} />}
      </main>
    </div>
  );
}

export default App;
