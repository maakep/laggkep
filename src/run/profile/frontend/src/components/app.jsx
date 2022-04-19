import * as React from "react";
import { ProfilePage } from "./profile-page";
import { SearchPage } from "./search-page";

export function App() {
  const [data, setData] = React.useState(window.serverData);

  return Boolean(data.length) ? (
    <ProfilePage data={data} />
  ) : (
    <SearchPage setData={setData} />
  );
}
