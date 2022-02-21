import { StyledComponent } from "styled-components";
import * as S from "./GrammarArticleRenderer.styles";
import MultiChineseRenderer from "./MultiChineseRenderer";

const cefrToNumber = (level: string) => {
  return ["A1", "A2", "B1", "B2", "C1"].indexOf(level);
};

interface GrammarArticleRendererProps {
  article: any;
}

const GrammarArticleRenderer: React.FC<GrammarArticleRendererProps> = ({
  article,
}) => {
  return (
    <>
      <S.TopRow>
        <S.ArticleLevel level={cefrToNumber(article.metadata.cefrLevel)}>
          {article.metadata.cefrLevel}
        </S.ArticleLevel>
        <S.OriginalLink>
          from the{" "}
          <a
            href={`https://resources.allsetlearning.com/${article.url}`}
            target="_blank"
            rel="noreferrer"
          >
            AllSet <S.DesktopOnly>Learning Chinese</S.DesktopOnly> Grammar Wiki
          </a>
        </S.OriginalLink>
      </S.TopRow>
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
            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: block.html }}></p>
            );
          // return <p>{block.html}</p>;
          case "jiegou":
            return (
              <S.Structure
                key={i}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          case "exampleSet":
            return (
              <S.ExampleSet key={i}>
                <MultiChineseRenderer children={block.children} />
              </S.ExampleSet>
            );
          case "list":
            if (block.ordered) {
              return (
                <ol
                  key={i}
                  dangerouslySetInnerHTML={{ __html: block.html }}
                ></ol>
              );
            } else {
              return (
                <ul
                  key={i}
                  dangerouslySetInnerHTML={{ __html: block.html }}
                ></ul>
              );
            }
          case "table":
            return (
              <S.Table
                key={i}
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );
        }
        return <div key={i}>UNKNOWN BLOCK</div>;
      })}
    </>
  );
};

export default GrammarArticleRenderer;
