(() => {
  const quoteElement = document.getElementById("daily-quote");
  const textElement = document.getElementById("daily-quote-text");
  if (!quoteElement || !textElement) return;

  fetch("https://lodbfofbneccfgurltgg.supabase.co/functions/v1/daily-quote", {
    headers: { Accept: "application/json" }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Daily quote request failed");
      return response.json();
    })
    .then((data) => {
      if (typeof data.quote !== "string" || !data.quote.trim()) {
        throw new Error("Daily quote response did not include a quote");
      }
      textElement.textContent = "“" + data.quote.trim() + "”";
      quoteElement.hidden = false;
    })
    .catch((error) => {
      console.error("Unable to load the daily quote.", error);
    });
})();
