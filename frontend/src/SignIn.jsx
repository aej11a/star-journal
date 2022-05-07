import { PAGES } from "./App";
export const SignInForm = ({ setCurrentPage }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setCurrentPage(PAGES.LOADING);
        fetch(process.env.REACT_APP_API_ENDPOINT + "/accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: e.target.email.value,
            password: e.target.password.value,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.result === "error") {
              setCurrentPage(PAGES.SIGNED_OUT);
            } else {
              localStorage.setItem("user_id", res.user_id);
              setCurrentPage(PAGES.SIGNED_IN);
            }
          });
      }}
    >
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  );
};
