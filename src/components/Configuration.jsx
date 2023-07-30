const config = {
    title: window.Config.title || (import.meta.env.REACT_APP_TITLE || "Radio"),
    title2: window.Config.title2 || (import.meta.env.REACT_APP_TITLE2 || "Elite12 // "),

    apihost: window.Config.apihost || (import.meta.env.REACT_APP_API_HOST || ""),
    chromeextensionid: window.Config.chromeextensionid || (import.meta.env.REACT_APP_CHROME_EXTENSION_ID || ""),
    rightslink: window.Config.rightslink || (import.meta.env.REACT_APP_RIGHTS_LINK || "https://datenschutz.elite12.de/"),

    showversion: "showversion" in window.Config ? window.Config.showversion : (("REACT_APP_SHOW_VERSION" in import.meta.env) ? import.meta.env.REACT_APP_TITLE : true),
    showclock: "showclock" in window.Config ? window.Config.showversion : (("REACT_APP_SHOW_CLOCK" in import.meta.env) ? import.meta.env.REACT_APP_SHOW_CLOCK : true),
    showrights: "showrights" in window.Config ? window.Config.showrights : (("REACT_APP_SHOW_RIGHTS" in import.meta.env) ? import.meta.env.REACT_APP_SHOW_RIGHTS : true),
    showstats: "showstats" in window.Config ? window.Config.showstats : (("REACT_APP_SHOW_STATS" in import.meta.env) ? import.meta.env.REACT_APP_SHOW_STATS : true),
    showarchive: "showarchive" in window.Config ? window.Config.showarchive : (("REACT_APP_SHOW_ARCHIVE" in import.meta.env) ? import.meta.env.REACT_APP_SHOW_ARCHIVE : true),
    showfooter: "showfooter" in window.Config ? window.Config.showfooter : (("REACT_APP_SHOW_FOOTER" in import.meta.env) ? import.meta.env.REACT_APP_SHOW_FOOTER : true),

    enableusers: "enableusers" in window.Config ? window.Config.enableusers : (("REACT_APP_ENABLE_USERS" in import.meta.env) ? import.meta.env.REACT_APP_ENABLE_USERS : true),

    version: import.meta.env.VITE_APP_VERSION || "dev",
};

export default config;
