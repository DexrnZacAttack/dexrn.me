/*
 * Copyright (c) 2024 DexrnZacAttack
 * This file is part of DexrnZacAttack.github.io.
 * https://github.com/DexrnZacAttack/DexrnZacAttack.github.io
 *
 * Licensed under the MIT License. See LICENSE file for details.
*/

// TODO: Create activities instead of only showing one at a time.

import validator from 'validator';
import {getTranslation} from "./settings.js";

const USERID = "485504221781950465";
const pfp: HTMLImageElement = document.querySelector("#pfp")!;
const customStatus: HTMLDivElement = document.querySelector("#customStatus")!;
const onlineState: HTMLDivElement = document.querySelector("#onlineState")!;
const platforms: HTMLDivElement = document.querySelector("#platforms")!;
var disc_platform: string[];
var disc_isOffline: boolean;

async function setAvatar(lyData: LanyardAPI): Promise<void> {
    const {
        discord_user: { avatar },
    } = lyData;
    const fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatar}.webp?size=512`;
    pfp.src = fullUrl;
    // pfp2.src = fullUrl;
}

async function setAvatarFrame(lyData: LanyardAPI): Promise<void> {
  const {
    discord_status,
    active_on_discord_mobile,
    active_on_discord_web,
    active_on_discord_desktop,
  } = lyData;

  const statusMapping = {
    online: { color: "#3ba45d", text: getTranslation("lanyard.status.online"), isOffline: false },
    dnd: { color: "#ed4245", text: getTranslation("lanyard.status.dnd"), isOffline: false },
    idle: { color: "#faa81a", text: getTranslation("lanyard.status.idle"), isOffline: false },
    offline: { color: "#747e8c", text: getTranslation("lanyard.status.offline"), isOffline: true },
    default: { color: "#747e8c", text: getTranslation("lanyard.status.unknown"), isOffline: true }
  };

  const { color, text, isOffline } = statusMapping[discord_status] || statusMapping.default;
  if (onlineState.innerText !== await text) {
    onlineState.innerText = await text;
    pfp.style.border = `2px solid ${color}`;
    pfp.style.boxShadow = `0 0 20px ${color}`;
    onlineState.style.cssText = `color: ${color}; opacity: ${isOffline ? 0.5 : 1};`;
    platforms.style.cssText = `color: ${color}; opacity: ${isOffline ? 0.5 : 1};`;
  }
  disc_isOffline = isOffline ?? false;

  const onlinePlatforms = [];
  if (active_on_discord_desktop) onlinePlatforms.push(await getTranslation("lanyard.platform.desktop"));
  if (active_on_discord_mobile) onlinePlatforms.push(await getTranslation("lanyard.platform.mobile"));
  if (active_on_discord_web) onlinePlatforms.push(await getTranslation("lanyard.platform.browser"));

  disc_platform = onlinePlatforms;
  if (!disc_isOffline && platforms.innerText !== `${await getTranslation("lanyard.platformsString")}${disc_platform}` && onlinePlatforms.length !== 0)
    platforms.innerText = `${await getTranslation("lanyard.platformsString")}${disc_platform}`;
}

async function setStatus(lyData: LanyardAPI): Promise<void> {
  const {
     discord_status, activities
  } = lyData;

  if (discord_status == "offline") {
    return;
  }

  if (activities) {
    const activityOfType4 = activities.find((m): m is LanyardActivity4 => m.type == 4);
    if (activityOfType4) {
      const { state } = activityOfType4;
      if (state) {
        if (customStatus.innerHTML !== validator.escape(state))
          customStatus.innerHTML = validator.escape(state);
      }
    }
  }

}

async function setActivityBigImage(activity: LanyardActivityLike, spotify: LanyardAPI["spotify"]): Promise<HTMLImageElement | undefined> {
  let bigImage: HTMLImageElement;

  if (!document.querySelector(`#activityImageBig_${activity.id}`)) {
    bigImage = document.createElement("img");
    bigImage.id = `activityImageBig_${activity.id}`;
    bigImage.className = "activityImageBig";
  } else {
    bigImage = document.querySelector(`#activityImageBig_${activity.id}`)!;
  }

  const mostRecent = activity;
  if (mostRecent?.emoji && !mostRecent?.assets?.large_image) {
    let ext = "webp";
    mostRecent?.emoji?.animated === true ? ext = "gif" : ext = "webp";
    bigImage.style.display = "block";
    if (bigImage.src !== `https://cdn.discordapp.com/emojis/${validator.escape(mostRecent.emoji.id)}.${ext}?quality=lossless`)
      bigImage.src = `https://cdn.discordapp.com/emojis/${validator.escape(mostRecent.emoji.id)}.${ext}?quality=lossless`;
    bigImage.title = validator.escape(mostRecent.emoji.name);
  } else if (!mostRecent?.assets?.large_image) {
    bigImage.style.display = "none";
    return;
  } else {
    const imageLink = mostRecent.assets.large_image.includes("external")
      ? `https://media.discordapp.net/external/${mostRecent.assets.large_image.split("mp:external/")[1]
      }`
      : `https://cdn.discordapp.com/app-assets/${validator.escape(mostRecent.application_id)}/${validator.escape(mostRecent.assets.large_image)}.png?quality=lossless`;
    if (mostRecent.assets.large_image.includes("spotify")) {
      bigImage.style.display = "block";
      bigImage.src = validator.escape(spotify!.album_art_url);
      bigImage.title = validator.escape(spotify!.album);
      return;
    }
    bigImage.style.display = "block";
    if (bigImage.src !== imageLink)
      bigImage.src = imageLink;
    bigImage.title = validator.escape(mostRecent.assets.large_text ?? "");
  }
  return document.querySelector(`#activityImageBig_${activity.id}`) ? undefined : bigImage;
}


async function setActivitySmallImage(activity: LanyardActivityLike): Promise<HTMLImageElement[]> {
  const mostRecent = activity;
  let smallImage: HTMLImageElement;
  let smallImageAlt: HTMLImageElement;

  if (!document.querySelector(`#activityImageSmallAlt_${activity.id}`)) {
    smallImageAlt = document.createElement("img");
    smallImageAlt.id = `activityImageSmallAlt_${activity.id}`;
    smallImageAlt.className = `activityImageSmallAlt`;
  } else {
    smallImageAlt = document.querySelector(`#activityImageSmallAlt_${activity.id}`)!;
  }
  
  if (!document.querySelector(`#activityImageSmall_${activity.id}`)) {
    smallImage = document.createElement("img");
    smallImage.id = `activityImageSmall_${activity.id}`;
    smallImage.className = `activityImageSmall`;
  } else {
    smallImage = document.querySelector(`#activityImageSmall_${activity.id}`)!;
  }

  const images: Array<HTMLImageElement> = [];

  if (
    !mostRecent ||
    !mostRecent?.assets?.small_image ||
    mostRecent.assets.small_image.includes("spotify")
  ) {
    smallImage.remove();
    smallImageAlt.remove();
    return images;
  }

  const imageLink = mostRecent.assets.small_image.includes("external")
    ? `https://media.discordapp.net/external/${mostRecent.assets.small_image.split("mp:external/")[1]
    }`
    : `https://cdn.discordapp.com/app-assets/${mostRecent.application_id}/${mostRecent.assets.small_image}.png?size=256`;

  if (!mostRecent.assets.large_image && mostRecent.assets.small_image) {
    if (smallImageAlt.style.display !== "block")
      smallImageAlt.style.display = "block";
    if (smallImageAlt.src !== imageLink)
      smallImageAlt.src = imageLink;
    if (smallImageAlt.title !== validator.escape(mostRecent.assets.small_text ?? ""))
      smallImageAlt.title = validator.escape(mostRecent.assets.small_text ?? "");
    images.push(smallImageAlt);
    images.push(smallImage);
  } else {
    if (smallImage.style.display !== "block")
      smallImage.style.display = "block";
    if (smallImage.src !== imageLink)
      smallImage.src = imageLink;
    if (smallImage.title !== validator.escape(mostRecent.assets.small_text ?? ""))
      smallImage.title = validator.escape(mostRecent.assets.small_text ?? "");
    images.push(smallImage);
  }
  return images;
}

async function setActivityName(activity: any): Promise<HTMLDivElement | undefined> {
  let activityName: HTMLDivElement;

  if (!document.querySelector(`#activityName_${activity.id}`)) {
    activityName = document.createElement('div');
    activityName.id = `activityName_${activity.id}`;
    activityName.className = "activityName";
  } else {
    activityName = document.querySelector(`#activityName_${activity.id}`)!;
  }
  const mostRecent = activity;
  if (!mostRecent?.name) {
    activityName.innerText = await getTranslation("lanyard.activity.namePlaceholder");
    return;
  }
  activityName.innerText = validator.escape(mostRecent.name);

  return document.querySelector(`#activityName_${activity.id}`) ? undefined : activityName;
}

async function setActivityState(activity: any): Promise<HTMLDivElement | undefined> {
  let activityState: HTMLDivElement;

  if (!document.querySelector(`#activityState_${activity.id}`)) {
    console.log("activityState doesn't exist");
    activityState = document.createElement('div');
    activityState.id = `activityState_${activity.id}`;
    activityState.className = "activityState";
  } else {
    console.log("activityState already exists");
    activityState = document.querySelector(`#activityState_${activity.id}`)!;
  }

  if (activity.length == 0) {
    console.log("length 0");
    return;
  }
  const mostRecent = activity;
  if (!mostRecent!.state) {
    console.log("no state");
    activityState.remove();
    return;
  }

  activityState.innerText = validator.escape(mostRecent!.state) ?? "";
  return document.querySelector(`#activityState_${activity.id}`) ? undefined : activityState;
}

async function setTimestamp(activity: any): Promise<HTMLDivElement | undefined> {
  let timeElapsed: HTMLDivElement;

  if (!document.querySelector(`#timeElapsed_${activity.id}`)) {
    timeElapsed = document.createElement('div');
    timeElapsed.id = `timeElapsed_${activity.id}`;
    timeElapsed.className = "activityTimeElapsed";
  } else {
    timeElapsed = document.querySelector(`#timeElapsed_${activity.id}`)!;
  }

  const created = activity?.timestamps?.start;
  if (!created) {
    timeElapsed.remove();
    return undefined;
  }

  const updateTimestamp = async () => {
    try {
      const current = new Date().getTime();
      const diff = current - created;

      if (diff > 0) {
        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        const formatTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        timeElapsed.innerText = `${formatTime}`;
      } else {
        timeElapsed.remove();
      }
    } catch {
      timeElapsed.remove();
    }
  };

  updateTimestamp();

  const interval = setInterval(updateTimestamp, 1000);

  return new Promise<HTMLDivElement | undefined>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(timeElapsed)) {
        clearInterval(interval);
        resolve(undefined);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    resolve(timeElapsed);
  });
}

async function setActivityDetails(activity: any): Promise<HTMLDivElement | undefined> {
  let activityDetail: HTMLDivElement;

  if (!document.querySelector(`#activityDetail_${activity.id}`)) {
    activityDetail = document.createElement('div');
    activityDetail.id = `activityDetail_${activity.id}`;
    activityDetail.className = "activityDetail";
  } else {
    activityDetail = document.querySelector(`#activityDetail_${activity.id}`)!;
  }

  if (activity.length == 0) {
    activityDetail.remove();
    return;
  }
  const mostRecent = activity;
  if (!mostRecent!.details) {
    activityDetail.remove();
    return;
  }
  activityDetail.style.display = "block";
  activityDetail.innerText = validator.escape(mostRecent!.details) ?? "";
  return document.querySelector(`#activityDetail_${activity.id}`) ? undefined : activityDetail;
}

enum PID {
  EventBW,      // s <-> c
  HelloS2C,     // s --> c
  InitC2S,      // s <-- c
  HeartbeatC2S  // s <-- c
}

interface LanyardPacket {
  op: PID,
  d: any
}

let activityIDs: string[] = [];

async function handleActivity(data: LanyardAPI): Promise<void> {
  const activityCard: HTMLDivElement = document.querySelector("#activityCard")!;
  const noActivity = document.createElement("h1");
  noActivity.innerText = await getTranslation("lanyard.noActivity");
  noActivity.id = "noActivity";
  noActivity.className = "activities";
  noActivity.style.paddingLeft = "10px";
  noActivity.style.marginBottom = "unset";
  noActivity.style.marginTop = "unset";

  const activityIDsNew = new Set<string>();
  for (const activity of data.activities) {
    activityIDsNew.add(activity.id);
  }

  for (const id of activityIDs) {
    if (!activityIDsNew.has(id)) {
      const activityElement = document.querySelector(`#activity_${id}`);
      if (activityElement) {
        activityElement.remove();
      }
    }
  }

  activityIDs = Array.from(activityIDsNew);

  if (data.activities.length === 0 && !document.querySelector('#noActivity'))
    document.querySelector("#activityCard")!.appendChild(noActivity);
  else if (document.querySelector("#noActivity"))
    document.querySelector("#activityCard")!.removeChild(noActivity);


  for (const activity of data.activities) {

    let activityElement: HTMLElement | null;
    let activityImages: HTMLElement | null;
    let activityInfo: HTMLElement | null;

    if (!document.querySelector(`#activity_${activity.id}`)) {
      activityElement = document.createElement('div');
      activityElement.id = `activity_${activity.id}`;
      activityElement.className = "activities";

      activityImages = document.createElement("div");
      activityImages.id = `activityImages_${activity.id}`;
      activityImages.className = "activityImages";

      activityInfo = document.createElement("div");
      activityInfo.id = `activityInfo_${activity.id}`;
      activityInfo.className = "activityInfo";
    } else {
      activityElement = document.querySelector(`#activity_${activity.id}`);
      activityImages = document.querySelector(`#activityImages_${activity.id}`);
      activityInfo = document.querySelector(`#activityInfo_${activity.id}`);
    }

    if (activityElement && activityImages && activityInfo) {
      activityElement.appendChild(activityImages);
      activityElement.appendChild(activityInfo);
      if (activityCard) {
        activityCard.appendChild(activityElement);
      }
    }



    const activityBigImage = await setActivityBigImage(activity, data.spotify);
    if (activityBigImage)
      activityImages!.appendChild(activityBigImage);

    const activitySmallImages = await setActivitySmallImage(activity);
    for (const image of activitySmallImages) {
      activityImages!.appendChild(image);
    }
    const activityName = await setActivityName(activity);
    if (activityName)
      activityInfo!.appendChild(activityName);

    const activityState = await setActivityState(activity);
    if (activityState)
      activityInfo!.appendChild(activityState);

    const activityDetails = await setActivityDetails(activity);
    if (activityDetails)
      activityInfo!.appendChild(activityDetails);

    const activityTimestamp = await setTimestamp(activity);
    if (activityTimestamp)
      activityInfo!.appendChild(activityTimestamp);

    const activityPathElement = document.querySelector("#activity-path") as HTMLDivElement;
    const activityCardPadding = parseInt(window.getComputedStyle(activityCard).padding, 10);
    const activityPathPaddingBottom = parseInt(window.getComputedStyle(activityPathElement).paddingBottom, 10);

    const totalSize = activityInfo!.offsetHeight
        + activityPathElement.offsetHeight
        + activityCardPadding * 2
        + activityPathPaddingBottom
        + 10
        + 10
        + 15;

    if (activityCard!.style.maxHeight !== totalSize + "px") {
      activityCard!.style.maxHeight = totalSize + "px";
    }
  }
}

const ws = new WebSocket("wss://api.lanyard.rest/socket");
ws.onmessage = async function (res)  { 
  try {
    const packet: LanyardPacket = JSON.parse(res.data);
    switch (packet.op) {
      // relogic style
      case PID.HelloS2C:
        ws.send(JSON.stringify({
          op: PID.InitC2S,
          d: { subscribe_to_id: USERID }
        }));
        const heartbeat = (packet.d).heartbeat_interval;
        setInterval(() => {
            ws.send(JSON.stringify({ op: PID.HeartbeatC2S }));
        }, heartbeat);
        break;
      case PID.EventBW:
            console.log("init")
            await setAvatar(packet.d);
            await setStatus(packet.d);
            await setAvatarFrame(packet.d);
            await handleActivity(packet.d);
            break;
      default:
        console.log(`RECEIVED UNKNOWN PACKET! ID: ${packet.d || "UNKNOWN"}`);
        break;
    }
  } catch (e) {
    console.log(e);
  }
};


