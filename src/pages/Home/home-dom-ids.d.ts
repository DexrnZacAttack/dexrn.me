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
    readonly discordPath: HTMLDivElement;
    readonly pfp: HTMLImageElement;
    readonly username: HTMLDivElement;
    readonly customStatus: HTMLDivElement;
    readonly onlineState: HTMLDivElement;
    readonly platforms: HTMLDivElement;
    readonly blogCard: HTMLCardElement;
    readonly activityCard: HTMLCardElement;
    readonly activityPath: HTMLDivElement;
    readonly aboutCard: HTMLCardElement;
    readonly aboutPath: HTMLDivElement;
    readonly abm1: HTMLLIElement;
    readonly abm2: HTMLLIElement;
    readonly linksCard: HTMLCardElement;
    readonly stuffPath: HTMLDivElement;
    readonly mainbtn3: HTMLButtonElement;
    readonly mainbtn1: HTMLButtonElement;
    readonly mainbtn2: HTMLButtonElement;
    readonly settings: HTMLDivElement;
    readonly settingsclose: HTMLTopCardElement;
    readonly backbtn: HTMLDivElement;
    readonly settingsDoNotHide: HTMLCardElement;
    readonly settingsPath: HTMLDivElement;
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