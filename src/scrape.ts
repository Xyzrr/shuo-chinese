(async () => {
  const fetch = (await import("node-fetch")).default;
  const parse = await (await import("node-html-parser")).parse;

  const fetchAndParse = async (url: string) => {
    const result = await fetch(url);
    return parse(await result.text());
  };

  const extractLinksFromListPage = (
    page: import("node-html-parser").HTMLElement
  ) => {
    const links: any[] = [];

    page.querySelectorAll(".wikitable").forEach((table) => {
      table.querySelectorAll("tr").forEach((row) => {
        const th = row.querySelector("th");
        if (th) {
          return;
        }

        const linkCell = row.querySelector("td:first-child");
        const patternCell = row.querySelector("td:nth-child(2)");
        const linkNode = linkCell?.querySelector("a");
        const url = linkNode?.getAttribute("href");
        const title = linkNode?.innerText;
        const pattern = patternCell?.innerText;

        links.push({
          url,
          title,
          pattern,
        });
      });
    });

    return links;
  };

  const baseURL = "https://resources.allsetlearning.com";
  const url =
    "https://resources.allsetlearning.com/chinese/grammar/A1_grammar_points";

  const listPage = await fetchAndParse(url);
  const links = extractLinksFromListPage(listPage);

  console.log("links", links);
})();
