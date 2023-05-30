import { useState } from "react";
import Glass from "../../assets/Glass";

export default function Search() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  return (
    <div>
      {!enabled && !isSearching ? (
        <div onMouseOver={() => setEnabled(true)}>
          <Glass />
        </div>
      ) : (
        <div onMouseLeave={() => setEnabled(false)}>Search</div>
      )}
    </div>
  );
}
