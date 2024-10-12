import { useEffect } from "react";
import Card from "../../components/Card.js";
import TopCard from "../../components/TopCard.js";
import loader from "/src/assets/loader.gif";
import loaderDark from "/src/assets/loader-dark.gif";
import youtube from "/src/assets/icons/youtube.png";
import discord from "/src/assets/icons/discord.svg";
import github from "/src/assets/icons/github.svg";
import twitter from "/src/assets/icons/twitter.png";

async function loadHomeScript(): Promise<void> {
  await import("../../index.js");
}

export default function Home() {
  useEffect(() => {
    loadHomeScript();
  }, []);

  return (
    <>
      <div className="loadingScreen" id="loadingScreen">
        <div className="loading">
          <img id="lightLoadingSpinner" src={loader} alt="Loading..."/>
          <img id="darkLoadingSpinner" src={loaderDark} alt="Loading..."/>
          <h1 className="loadingText hidden" id="loadingText"></h1>
          <div className="lBG"></div>
        </div>
      </div>
      <div className="bg" id="homepage">
        <div className="mainCardsContainer" id="mainCardsContainer" style={{ display: "flex", flexDirection: "column" }}>
          <div id="tabs" style={{ display: "flex", flexDirection: "row" }}>
            <button className="tabButtonClicked" id="discordTabButton" onClick={() => changeMainCard('Discord')}>Discord</button>
            <button className="tabbutton" id="blogTabButton" onClick={() => changeMainCard('Blog')} style={{ marginLeft: "10px" }}>Blog</button>
            {/* <!-- <button className="tabbutton" id="steambutton" style={{align-self: baseline; margin-left:2%;" onclick="changeMainCard('Steam');">Steam</button> --> */}
            <button className="tabbutton" id="settingsTabButton" style={{ marginRight: 0, marginLeft: "auto" }}></button>
          </div>
          {/* <!-- MAIN CARD --> */}
          <Card id="mainCard" style={{width: "100%", borderTopLeftRadius: "0%", borderTopRightRadius: "0%"}}>
            <div className="cardTitle" id="discordPath"></div>
            <div className="user-profile">
              <div className="Profile-pic">
                          <img id="pfp" src={loader}/>
              </div>
              <div className="user-info">
                <div id="username">Dexrn ZacAttack</div>
                <div id="customStatus"></div>
                <div id="onlineState"></div>
                <div id="platforms"></div>
                <div className="connections">
                  <a title="YouTube" href="https://youtube.com/@DZac">
                    <img className="connection-icon" src={youtube} alt="YouTube"/>
                  </a>
                  <a title="Discord" href="https://discord.com/users/485504221781950465/">
                    <img className="connection-icon" src={discord} alt="Discord"/>
                  </a>
                  <a title="GitHub" href="https://github.com/DexrnZacAttack/">
                    <img className="connection-icon" src={github} alt="GitHub"/>
                  </a>
                  <a title="Twitter" href="https://twitter.com/DexrnZacAttack/">
                    <img className="connection-icon" src={twitter} alt="Twitter"/>
                  </a>
                </div>
              </div>
            </div>
          </Card>
          {/* <!-- BLOG CARD --> */}
          <Card id="blogCard" style={{width: "100%", borderTopLeftRadius: 0, borderTopRightRadius: 0, display: "none"}}/>
        </div>
        {/* <!-- DISCORD ACTIVITY CARD --> */}
        <Card className="activity" id="activityCard">
          <div className="cardTitle" id="activityPath"></div>
        </Card>
        {/* <!-- ABOUT ME CARD --> */}
        <Card id="aboutCard">
          <div className="cardTitle" id="aboutPath"></div>
          <div className="about-me">
            <ul style={{listStyle: "none", padding: 0}}>
              <li style={{listStyle: "none", padding: 0}} id="abm1"></li>
              <li style={{listStyle: "none", padding: 0}} id="abm2"></li>
            </ul>
          </div>
        </Card>
        {/* <!-- LINKS CARD --> */}
        <Card id="linksCard">
          <div className="cardTitle" id="stuffPath"></div>
          <div className="about-me">
            <div className="bio">
              {/* linkto is from the fade.ts, for showing an animation on click. */}
              <button className="button buttonRedirect" data-linkto="LCETools/" id="mainbtn3"></button>
              <button className="button buttonRedirect" data-linkto="QMGInfo/" id="mainbtn1"></button>
              <button className="button" id="mainbtn2"></button>
    </div>
            </div>
          </Card>
          {/* <!-- SETTINGS CARD --> */}
        <div id="settings" style={{height: "350px"}}>
          {/* <!-- why does this break with <topcard> instead of <div className="topcard"> --> */}
          <TopCard id="settingsclose" style={{cursor: "pointer", width: "300px", marginBottom: "8px"}}>
            <div className="back" id="backbtn"></div>
          </TopCard>
          <Card id="settingsDoNotHide" style={{width: "auto", height: "350px"}}>
            <div className="cardTitle" id="settingsPath"></div>
            <div className="options"
              style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
              <h3 id="languagetxt"></h3>
              <select id="language2" className="drpdwnbtn" name="language2" defaultValue="unselected">
                <option defaultValue="unselected" disabled /*selected*/ id="selopt"></option>
                <option defaultValue="en-US">English</option>
                <option defaultValue="zh-CN">中文</option>
              </select>
              <h3 id="themetxt"></h3>
              <select id="themeOption" className="drpdwnbtn" name="themeOption" defaultValue="unselectedtheme">
                <option defaultValue="unselectedtheme" disabled /*selected*/ id="selopt2"></option>
                <option defaultValue="default-dark" id="darkthmopt"></option>
                <option defaultValue="default-light" id="lightthmopt"></option>
              </select>
              <button className="buttonalt2" id="saveBtn" style={{position: "absolute", bottom: 0}}></button>
            </div>
          </Card>
          {/* <!-- Last update date --> */}
          <p className="lastUpdated" id="lastUpdated"></p>
        </div>
      </div>
      <a rel="me" href="https://wetdry.world/@zach" style={{display:"none"}}>Mastodon</a>
    </>
  );
}