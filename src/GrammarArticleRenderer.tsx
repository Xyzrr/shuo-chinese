import ChineseRenderer from "./ChineseRenderer";
import * as S from "./GrammarArticleRenderer.styles";

interface GrammarArticleRendererProps {
  article: any;
}

const GrammarArticleRenderer: React.FC<GrammarArticleRendererProps> = ({
  article,
}) => {
  return (
    <>
      {article.blocks.map((block: any, i: any) => {
        switch (block.type) {
          case "heading":
            return <S.Heading key={i}>{block.text}</S.Heading>;
          case "paragraph":
            return <p dangerouslySetInnerHTML={{ __html: block.html }}></p>;
          // return <p>{block.html}</p>;
          case "exampleSet":
            console.log("children", block.children);
            return (
              <S.ExampleSet key={i}>
                {block.children.map((example: any) => {
                  return (
                    <>
                      <ChineseRenderer words={example.chineseWords} />
                    </>
                  );
                })}
              </S.ExampleSet>
            );
        }
        return <div></div>;
      })}
    </>
  );
};

export default GrammarArticleRenderer;
