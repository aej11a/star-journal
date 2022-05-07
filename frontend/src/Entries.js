import { useState, useEffect, useRef } from "react";
import { PAGES } from "./App";

export const Entries = ({ setCurrentPage }) => {
  const [entries, setEntries] = useState({
    filteredEntries: [],
    unfilteredEntries: [],
  });

  const tagFilterInput = useRef(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/get-journal-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setEntries({
          filteredEntries: res.journal_entries.reverse(),
          unfilteredEntries: res.journal_entries.reverse(),
        });
      });
  }, []);

  return (
    <div className="entries">
      <button onClick={(e) => setCurrentPage(PAGES.NEW_ENTRY)}>
        New entry...
      </button>
      <br />
      <br />
      <label>Filter by tags: </label>
      <input type="text" placeholder="Type a tag..." ref={tagFilterInput} />
      <button
        onClick={(e) => {
          setEntries({
            ...entries,
            filteredEntries: entries.unfilteredEntries.filter((entry) =>
              entry.tags.includes(tagFilterInput.current.value)
            ),
          });
        }}
      >
        Apply
      </button>
      {entries?.filteredEntries.length &&
        entries.filteredEntries
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((entry) => {
            return (
              <div className="entry">
                <p>{new Date(entry.createdAt * 1000).toDateString()}</p>
                {entry.tags.map((tag) => (
                  <span className="tag">{tag}</span>
                ))}
                <h3>Situation</h3>
                <p>{entry.situation}</p>
                <h3>Task</h3>
                <p>{entry.task}</p>
                <h3>Action</h3>
                <p>{entry.action}</p>
                <h3>Results</h3>
                <p>{entry.result}</p>
              </div>
            );
          })}
    </div>
  );
};
