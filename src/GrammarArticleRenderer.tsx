import { StyledComponent } from "styled-components";
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
      <S.H1>{article.title}</S.H1>
      {article.blocks.map((block: any, i: any) => {
        switch (block.type) {
          case "heading":
            let Component: StyledComponent<"h2" | "h3" | "h4" | "h5", any>;
            switch (block.level) {
              case 1:
                Component = S.H1;
                break;
              case 2:
                Component = S.H2;
                break;
              case 3:
                Component = S.H3;
                break;
              default:
                Component = S.H4;
                break;
            }
            return <Component key={i}>{block.text}</Component>;
          case "paragraph":
            return <p dangerouslySetInnerHTML={{ __html: block.html }}></p>;
          // return <p>{block.html}</p>;
          case "jiegou":
            return (
              <S.Structure dangerouslySetInnerHTML={{ __html: block.html }} />
            );
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
          case "unordered-list":
            return <ul dangerouslySetInnerHTML={{ __html: block.html }}></ul>;
        }
        return <div></div>;
      })}
    </>
  );
};

export default GrammarArticleRenderer;
