import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import qs from "query-string";
const UsersSearchInput = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(false);
  const debouncedSearch = debounce((value) => {
    const query = {
      search: value,
    };
    const url = qs.stringifyUrl({
      url: "/users",
      query,
    });
    router.push(url);
  }, 1000);

  useEffect(() => {
    if (searchTerm.length !== 0) {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleSearchChange = useCallback((e: any) => {
    setSearchTerm(e.target.value);
  }, []);
  return (
    <div className="min-w-full flex items-center justify-between">
      <input
        disabled={isLoading}
        onChange={handleSearchChange}
        value={searchTerm}
        placeholder={"search @user"}
        type={"text"}
        className="w-full p-4 text-lg bg-black border-2 border-neutral-800 outline-none text-white focus:border-sky-500 focus:border-2 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed "
      />
    </div>
  );
};

export default UsersSearchInput;
