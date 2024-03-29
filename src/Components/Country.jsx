import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import "../styles/country.css";

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function Country() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchAllCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      setAllCountries(data);
      setSearchResult(data);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCountries();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCurrency(value);
    debouncedSearch(value.toUpperCase());
  };

  const debouncedSearch = debounce((value) => {
    searchCountries(value);
  }, 500);

  const searchCountries = (value) => {
    try {
      if (value === "") {
        setSearchResult(allCountries);
        setError(null);
        return;
      }

      const filteredCountries = allCountries.filter((country) => {
        return (
          country.currencies &&
          Object.keys(country.currencies).some((currencyCode) =>
            currencyCode.startsWith(value)
          )
        );
      });

      if (filteredCountries.length === 0) {
        setSearchResult([]);
        setError("No countries found with this currency code");
      } else {
        setSearchResult(filteredCountries);
        setError(null);
      }
    } catch (error) {
      console.error("Error searching countries:", error);
      setSearchResult([]);
      setError("Error searching countries");
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(searchResult.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Currency to Country Search</h1>
      <form>
        <input
          type="text"
          placeholder="Search By currency INR ,EUR"
          value={currency}
          onChange={handleInputChange}
          className="input-field"
        />
        {loading && (
          <div>
            <img
              src="https://media1.tenor.com/m/_dGu36t3VNEAAAAC/loading-buffering.gif"
              alt="Loading..."
            />
          </div>
        )}
      </form>

      {error ? (
        <div className="error-container">
          {error && (
            <div>
              <img
                src="https://media1.tenor.com/m/unvXyxtdn3oAAAAC/no-result.gif"
                alt="No countries found with this currency code"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="countries-grid">
          {searchResult
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((el) => (
              <div key={el.name.common} className="country-card">
                <div className="image-container">
                  <img
                    src={el.flags?.png}
                    alt={el.region}
                    className="country-image"
                  />
                </div>
                <p className="country-name">Country: {el.name?.common}</p>
                <p>Capital: {el.capital}</p>
                <p>
                  Currency Code:{" "}
                  {el.currencies ? (
                    Object.keys(el.currencies).map((currencyCode, index) => (
                      <span key={index}>{currencyCode}</span>
                    ))
                  ) : (
                    <span>No currency</span>
                  )}
                </p>
                <p>
                  Currency:{" "}
                  {el.currencies ? (
                    Object.keys(el.currencies).map((currencyCode, index) => (
                      <span key={index}>
                        {el.currencies[currencyCode].name}
                      </span>
                    ))
                  ) : (
                    <span>No currency</span>
                  )}
                </p>
                <p>
                  Currency symbol:{" "}
                  {el.currencies ? (
                    Object.keys(el.currencies).map((currencyCode, index) => (
                      <span style={{ fontWeight: "bold" }} key={index}>
                        {el.currencies[currencyCode].symbol}
                      </span>
                    ))
                  ) : (
                    <span>No currency</span>
                  )}
                </p>
              </div>
            ))}
        </div>
      )}
      <Pagination pageNumbers={pageNumbers} paginate={paginate} />
    </div>
  );
}

export default Country;
