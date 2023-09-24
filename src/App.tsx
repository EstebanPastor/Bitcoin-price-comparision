import { useState, useEffect } from "react";

import axios from "axios";
import { sortBy } from "lodash";

import AmountInput from "./components/AmountInput";
import ResultRow from "./components/ResultRow";

type CachedResult = {
  provider: string;
  btc: string;
}



const App = () => {
  const [amount, setAmount] = useState("100");
  const [cachedResults, setCachedResults] = useState<CachedResult>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://sijwi3sm2b.us.aircode.run/cachedValues").then((res) => {
      setCachedResults(res.data);
      setLoading(false);
    });
  }, []);

  const sortedCache = sortBy(cachedResults, 'btc').reverse()

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
          <>
            <ResultRow loading={true} />
            <ResultRow loading={true} />
            <ResultRow loading={true} />
            <ResultRow loading={true} />
          </>
        )}
        {!loading && sortedCache.map((result:CachedResult, index:number) => (
          <ResultRow key={index} providerName={result.provider}
          btc={result.btc}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
