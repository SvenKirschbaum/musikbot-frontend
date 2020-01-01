export default {
    title: window.Config.title || (process.env.REACT_APP_TITLE || "Radio"),
    title2: window.Config.title2 || (process.env.REACT_APP_TITLE2 || "Elite12 // "),

    apihost: window.Config.apihost || (process.env.REACT_APP_API_HOST || ""),
    chromeextensionid: window.Config.chromeextensionid || (process.env.REACT_APP_CHROME_EXTENSION_ID ||""),
    rightslink: window.Config.rightslink || (process.env.REACT_APP_RIGHTS_LINK || "https://datenschutz.elite12.de/"),

    showversion: "showversion" in window.Config ? window.Config.showversion : (("REACT_APP_SHOW_VERSION" in process.env) ? process.env.REACT_APP_TITLE : true),
    showlogos: "showlogos" in window.Config ? window.Config.showlogos : (("REACT_APP_SHOW_LOGOS" in process.env) ? process.env.REACT_APP_SHOW_LOGOS : true),
    showclock: "showclock" in window.Config ? window.Config.showversion : (("REACT_APP_SHOW_CLOCK" in process.env) ? process.env.REACT_APP_SHOW_CLOCK : true),
    showrights: "showrights" in window.Config ? window.Config.showrights : (("REACT_APP_SHOW_RIGHTS" in process.env) ? process.env.REACT_APP_SHOW_RIGHTS : true),
    showstats: "showstats" in window.Config ? window.Config.showstats : (("REACT_APP_SHOW_STATS" in process.env) ? process.env.REACT_APP_SHOW_STATS : true),
    showarchive: "showarchive" in window.Config ? window.Config.showarchive : (("REACT_APP_SHOW_ARCHIVE" in process.env) ? process.env.REACT_APP_SHOW_ARCHIVE : true),
    showfooter: "showfooter" in window.Config ? window.Config.showfooter : (("REACT_APP_SHOW_FOOTER" in process.env) ? process.env.REACT_APP_SHOW_FOOTER : true),

    enableusers: "enableusers" in window.Config ? window.Config.enableusers : (("REACT_APP_ENABLE_USERS" in process.env) ? process.env.REACT_APP_ENABLE_USERS : true),

    version: process.env.REACT_APP_VERSION || "dev",
};