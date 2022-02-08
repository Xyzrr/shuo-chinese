import React from "react";
import logo from "./logo.svg";
import "./App.css";
import A1 from "./articles/A1.json";
import ChineseRenderer from "./ChineseRenderer";

const cards: any[] = [];

A1.forEach((article) => {
  article.blocks.forEach((block) => {
    if (block.type === "exampleSet") {
      block.children?.forEach((example) => {
        cards.push({ ...example, level: "A1", article: article.title });
      });
    }
  });
});

const App: React.FC = () => {
  return (
    <div className="App">
      <p>
        {cards.map((card) => (
          <>
            <div>{card.english}</div>
            <ChineseRenderer words={card.chineseWords} />
          </>
        ))}
      </p>
    </div>
  );
};

export default App;
