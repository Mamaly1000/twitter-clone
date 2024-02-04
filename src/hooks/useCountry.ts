import countries from "world-countries";
export type SingleCountryType = {
  value: string;
  label: string;
  region: string;
  city: string;
};
const formattedCountries: SingleCountryType[] = countries.map((c) => ({
  value: c.cca2,
  label: c.name.common,
  region: c.region,
  city: c.capital[0],
}));
const useCountry = () => {
  const getAll = () => formattedCountries;
  const getByValue = (value: string) => {
    if (value)
      return formattedCountries.find(
        (c) => c.value.toLowerCase() === value?.toLowerCase()
      );
  };
  return { getAll, getByValue };
};

export default useCountry;
