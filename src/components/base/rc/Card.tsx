import { HTMLAttributes } from "react";

export interface ICardProps {
  title: string;
  action?: React.ReactNode;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
}

function Card(props: ICardProps & HTMLAttributes<HTMLDivElement>) {
  const { title, action, description, image } = props;

  return (
    <div className="b3-card" {...props}>
      {image && (
        <div className="b3-card__img">
          <img src={image.url} alt={image.alt} />
        </div>
      )}
      <div className="fn__flex-1 fn__flex-column">
        <div className="b3-card__info b3-card__info--left fn__flex-1">
          {title}
          <div className="b3-card__desc">{description}</div>
        </div>
      </div>
      <div className="b3-card__actions b3-card__actions--right">{action}</div>
    </div>
  );
}
export default Card;
