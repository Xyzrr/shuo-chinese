import React, { MouseEventHandler } from "react";
import * as S from "./InteractiveExample.styles";
import EnglishRenderer from "./EnglishRenderer";
import MultiEnglishRenderer from "./MultiEnglishRenderer";
import MultiChineseRenderer from "./MultiChineseRenderer";
import ChineseRenderer from "./ChineseRenderer";
import { articleFromCard } from "./card-utils";

interface InteractiveExampleProps {
  reveal: "none" | "answer" | "article";
  searchString: string;

  active: boolean;
  card: any;
  searching?: boolean;
  onClickEnglish: MouseEventHandler;
  onClickShowArticle: MouseEventHandler;
  onClickAnswer: MouseEventHandler;
}

const InteractiveExample: React.FC<InteractiveExampleProps> = ({
  reveal,
  searchString,

  active,
  card,
  searching,
  onClickEnglish,
  onClickShowArticle,
  onClickAnswer,
}) => {
  const sourceArticle = articleFromCard(card);

  return (
    <S.EnglishItem reveal={reveal} onClick={onClickEnglish} active={active}>
      <S.EnglishItemInner>
        {card.multi ? (
          <MultiEnglishRenderer
            children={card.children}
            searchString={searching ? searchString : undefined}
          />
        ) : (
          <EnglishRenderer
            english={card.english}
            explanation={card.explanation}
            searchString={searching ? searchString : undefined}
          />
        )}
      </S.EnglishItemInner>
      {active && reveal === "answer" && sourceArticle != null && (
        <S.AnswerWrapper onClick={onClickAnswer}>
          {card.multi ? (
            <MultiChineseRenderer children={card.children} hideEnglish />
          ) : (
            <ChineseRenderer chineseWords={card.chineseWords} />
          )}
          <S.ShowArticleButton
            className="no-popup"
            onClick={onClickShowArticle}
          >
            <S.ArticleLevelIndicator level={card.level} />
            <span
              dangerouslySetInnerHTML={{
                __html: sourceArticle.pattern,
              }}
            />
          </S.ShowArticleButton>
        </S.AnswerWrapper>
      )}
    </S.EnglishItem>
  );
};

export default InteractiveExample;
