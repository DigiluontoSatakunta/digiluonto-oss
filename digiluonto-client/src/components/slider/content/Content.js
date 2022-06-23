import React from "react";
import loadable from "@loadable/component";

import { IframeContent } from "./types/IframeContent";
import { AudioContent } from "./types/AudioContent";
import { LinkContent } from "./types/LinkContent";

const VideoContent = loadable(
  () => import(/* webpackChunkName: "contentVideo" */ "./types/VideoContent"),
  { resolveComponent: components => components.VideoContent }
);

export const Content = ({ link, loop, group, place, uid }) => {
  if (!link?.url) return null;

  if ("LINK" === link.type)
    return <LinkContent link={link} place={place} group={group} uid={uid} />;
  else if ("IFRAME" === link.type)
    return <IframeContent link={link} place={place} group={group} uid={uid} />;
  else if ("VIDEO" === link.type)
    return <VideoContent link={link} place={place} group={group} uid={uid} />;
  else if ("AUDIO" === link.type)
    return <AudioContent link={link?.url} loop={loop} />;

  return null;
};
