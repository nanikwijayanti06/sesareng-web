import { useState } from "react";
import imageMap from "../../assets/imageMap";
import "../../styles/actorAvatar.css";

function initialsFor(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ActorAvatar({ assetKey, name, icon: Icon, className = "", iconSize = 20 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSource = imageMap[assetKey];
  const showFallback = !imageSource || imageFailed;

  return (
    <span
      className={`actor-avatar ${className}`.trim()}
      aria-label={name}
      role="img"
    >
      {showFallback ? (
        Icon ? <Icon size={iconSize} aria-hidden="true" /> : initialsFor(name)
      ) : (
        <img alt="" onError={() => setImageFailed(true)} src={imageSource} />
      )}
    </span>
  );
}

export default ActorAvatar;