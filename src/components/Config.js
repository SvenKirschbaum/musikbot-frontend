export default {
    title: process.env.REACT_APP_TITLE || "Radio",
    title2: process.env.REACT_APP_TITLE2 || "Elite12 // ",

    apihost: process.env.REACT_APP_API_HOST || "",
    rightslink: process.env.REACT_APP_RIGHTS_LINK || "https://datenschutz.elite12.de/",

    showversion: ("REACT_APP_SHOW_VERSION" in process.env) ? process.env.REACT_APP_TITLE : true,
    showlogos: ("REACT_APP_SHOW_LOGOS" in process.env) ? process.env.REACT_APP_SHOW_LOGOS : true,
    showclock: ("REACT_APP_SHOW_CLOCK" in process.env) ? process.env.REACT_APP_SHOW_CLOCK : true,
    showrights: ("REACT_APP_SHOW_RIGHTS" in process.env) ? process.env.REACT_APP_SHOW_RIGHTS : true,
    showstats: ("REACT_APP_SHOW_STATS" in process.env) ? process.env.REACT_APP_SHOW_STATS : true,
    showarchive: ("REACT_APP_SHOW_ARCHIVE" in process.env) ? process.env.REACT_APP_SHOW_ARCHIVE : true,
    showfooter: ("REACT_APP_SHOW_FOOTER" in process.env) ? process.env.REACT_APP_SHOW_FOOTER : true,

    enableusers: ("REACT_APP_ENABLE_USERS" in process.env) ? process.env.REACT_APP_ENABLE_USERS : true,

    version: process.env.REACT_APP_VERSION || "dev",
};