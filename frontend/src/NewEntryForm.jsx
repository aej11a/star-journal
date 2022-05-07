import { PAGES } from "./App";
export const NewEntryForm = ({ setCurrentPage }) => {
    console.log(typeof setCurrentPage)
  return (
    <form
        className="new-entry-form"
      onSubmit={(e) => {
        e.preventDefault();
        setCurrentPage(PAGES.LOADING);
        fetch(process.env.REACT_APP_API_ENDPOINT + "/journal-entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            situation: e.target.Situation.value,
            task: e.target.Task.value,
            action: e.target.Actions.value,
            result: e.target.Results.value,
            tags: e.target.Tags.value,
            user_id: localStorage.getItem("user_id"),
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            setCurrentPage(PAGES.SIGNED_IN);
          });
      }}
    >
      <FormField name="Situation" />
      <FormField name="Task" />
      <FormField name="Actions" />
      <FormField name="Results" />
      <FormField name="Tags" desc="(as a comma-separated list)"/>
      <br/>
      <button type="submit">Submit</button>
    </form>
  );
};

const FormField = ({ name, desc }) => (
  <>
    <label htmlFor={name}>{name} {desc}</label>
    <input type="text" id={name} name={name} placeholder={name + "..."}/>
  </>
);
