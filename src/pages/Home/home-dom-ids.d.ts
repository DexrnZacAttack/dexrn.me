declare global {
  type HTMLCardElement = HTMLDivElement;
  type HTMLTopCardElement = HTMLDivElement;

  interface Window {
    readonly loadingScreen: HTMLDivElement;
    readonly lightLoadingSpinner: HTMLImageElement;
    readonly darkLoadingSpinner: HTMLImageElement;
    readonly loadingText: HTMLHeadingElement;
    readonly homepage: HTMLDivElement;
    readonly mainCardsContainer: HTMLDivElement;
    readonly tabs: HTMLDivElement;
    readonly discordTabButton: HTMLButtonElement;
    readonly blogTabButton: HTMLButtonElement;
    // readonly steambutton: HTMLButtonElement;
    readonly settingsTabButton: HTMLButtonElement;
    readonly mainCard: HTMLCardElement;
    readonly "discord-path": HTMLDivElement;
    readonly pfp: HTMLImageElement;
    readonly username: HTMLDivElement;
    readonly customStatus: HTMLDivElement;
    readonly onlineState: HTMLDivElement;
    readonly platforms: HTMLDivElement;
    readonly blogCard: HTMLCardElement;
    readonly activityCard: HTMLCardElement;
    readonly "activity-path": HTMLDivElement;
    readonly aboutCard: HTMLCardElement;
    readonly "about-path": HTMLDivElement;
    readonly "abm-1": HTMLLIElement;
    readonly "abm-2": HTMLLIElement;
    readonly linksCard: HTMLCardElement;
    readonly "stuff-path": HTMLDivElement;
    readonly "mainbtn-3": HTMLButtonElement;
    readonly "mainbtn-1": HTMLButtonElement;
    readonly "mainbtn-2": HTMLButtonElement;
    readonly settings: HTMLDivElement;
    readonly settingsclose: HTMLTopCardElement;
    readonly backbtn: HTMLDivElement;
    readonly settingsDoNotHide: HTMLCardElement;
    readonly "settings-path": HTMLDivElement;
    readonly languagetxt: HTMLHeadingElement;
    readonly language2: HTMLSelectElement;
    readonly selopt: HTMLOptionElement;
    readonly themetxt: HTMLHeadingElement;
    readonly themeOption: HTMLSelectElement;
    readonly selopt2: HTMLOptionElement;
    readonly darkthmopt: HTMLOptionElement;
    readonly lightthmopt: HTMLOptionElement;
    readonly saveBtn: HTMLButtonElement;
    readonly lastUpdated: HTMLParagraphElement;
  }
}

export {};