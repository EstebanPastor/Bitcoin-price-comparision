import { useState, useEffect } from "react";

import axios from "axios";
import useDebouncedEffect from "use-debounced-effect";
import { sortBy } from "lodash";

import AmountInput from "./components/AmountInput";
import ResultRow from "./components/ResultRow";
import LoadingSkeleton from "./components/LoadingSkeleton";

type CachedResult = {
  provider: string;
  btc: string;
};

type OfferResults = {
  [key: string]: string;
};

const defaultAmount = "100";

const App = () => {
  const [prevAmount, setPrevAmount] = useState(defaultAmount);
  const [amount, setAmount] = useState(defaultAmount);
  const [cachedResults, setCachedResults] = useState<CachedResult>([]);
  const [offerResults, setOfferResults] = useState<OfferResults>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://sijwi3sm2b.us.aircode.run/cachedValues").then((res) => {
      setCachedResults(res.data);
      setLoading(false);
    });
  }, []);

  useDebouncedEffect(
    () => {
      if (amount === defaultAmount) {
      }
      if (amount !== prevAmount) {
        setLoading(true);
        axios
          .get(`https://sijwi3sm2b.us.aircode.run/offers?amount=${amount}`)
          .then((res) => {
            setLoading(false);
            setOfferResults(res.data);
            setPrevAmount(amount);
          });
      }
    },
    300,
    [amount]
  );

  const sortedCache = sortBy(cachedResults, "btc").reverse();

  const sortedResults: CachedResult = sortBy(
    Object.keys(offerResults).map((provider) => ({
      provider,
      btc: offerResults[provider],
    })),
    "btc"
  ).reverse();

  const showCached = amount === defaultAmount;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="uppercase text-6xl text-center font-bold bg-gradient-to-br from-purple-600 to-sky-400 bg-clip-text text-transparent from-30%">
        Find cheapest BTC
      </h1>
      <div className="flex justify-center mt-6 ">
        <AmountInput
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-6">
        {loading && (
         <LoadingSkeleton />
        )}
        {!loading &&
          showCached &&
          sortedCache.map((result: CachedResult) => (
            <ResultRow
              key={result.provider}
              providerName={result.provider}
              btc={result.btc}
            />
          ))}
        {!loading &&
          !showCached &&
          sortedResults.map((result) => (
            <ResultRow
              key={result.provider}
              providerName={result.provider}
              btc={result.btc}
            />
          ))}
      </div>
    </main>
  );
};

export default App;
