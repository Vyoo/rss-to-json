module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/rss.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/rss.js":
/*!********************!*\
  !*** ./src/rss.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(/*! util */ "util"),
    xml = __webpack_require__(/*! xml2json */ "xml2json"),
    axios = __webpack_require__(/*! axios */ "axios");

module.exports = {
  isUrl: function (s) {
    return s && /((http(s)?):\/\/[\w\.\/\-=?#]+)/i.test(s);
  },
  load: function (x, callback) {
    var _this = this;

    var o = {
      method: "get",
      headers: {
        //'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36',
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36 OPR/68.0.3618.63",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    };

    if (typeof x === "object" && x !== null) {
      o = Object.assign(o, x);
    } else if (this.isUrl(x)) {
      o = Object.assign(o, {
        url: x
      });
    }

    return new Promise(function (resolve, reject) {
      axios(o).then(function ({
        data
      }) {
        var result = _this.parser(data);

        callback && callback(null, result);
        resolve(result);
      }).catch(function (err) {
        console.log(err);
        callback && callback(err, null);
        reject(err);
      });
    });
  },
  parser: function (data) {
    var rss = {
      items: []
    };
    var result = xml.toJson(data, {
      object: true
    }); // console.log(result.rss.channel.item[0]);
    // return;

    var channel = result.rss && result.rss.channel ? result.rss.channel : result.feed;
    if (util.isArray(channel)) channel = channel[0];
    var items = channel.item || channel.entry;

    if (channel.title) {
      rss.title = channel.title;
    }

    if (channel.description) {
      rss.description = channel.description;
    }

    rss.link = channel.link && channel.link.href ? channel.link.href : channel.link;
    rss.category = channel.category || [];

    if (channel.image) {
      rss.image = channel.image.url;
    }

    if (!rss.image && channel["itunes:image"]) {
      rss.image = channel["itunes:image"].href;
    }

    if (channel["itunes:author"]) {
      rss.author = channel["itunes:author"] || "";
    }

    if (items && !Array.isArray(items)) {
      // the main 'items' code block below expects the items variable to be an Array of Objects
      // but if in the originating XML the channel element contains only a single item, the items
      // variable is set to a literal Object instead of an Array of Objects of length 1. It is fixed
      // here so the items variable behaves the same whether it contains 1 or many items
      items = [items];
    }

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        var val = items[i];
        var obj = {};
        obj.title = val.title && val.title.$t ? val.title.$t : val.title;
        obj.id = val.guid && val.guid.$t ? val.guid.$t : val.id;
        obj.description = val.summary && val.summary.$t ? val.summary.$t : val.description;
        obj.url = val.link && val.link.href ? val.link.href : val.link;
        obj.link = obj.url;
        obj.author = val.author && val.author.name ? val.author.name : val["dc:creator"];
        obj.created = val.updated ? Date.parse(val.updated) : val.pubDate ? Date.parse(val.pubDate) : Date.now;
        obj.category = val.category || [];
        obj.content = val.content && val.content.$t ? val.content.$t : null; // Medium Support via @sstrubberg

        if (val["content:encoded"]) {
          obj.content_encoded = val["content:encoded"];
          obj.content = obj.content_encoded;
        }

        if (val["itunes:subtitle"]) {
          obj.itunes_subtitle = val["itunes:subtitle"];
        }

        if (val["itunes:summary"]) {
          obj.itunes_summary = val["itunes:summary"];
        }

        if (val["itunes:author"]) {
          obj.itunes_author = val["itunes:author"];
        }

        if (val["itunes:explicit"]) {
          obj.itunes_explicit = val["itunes:explicit"];
        }

        if (val["itunes:duration"]) {
          obj.itunes_duration = val["itunes:duration"];
        }

        if (val["itunes:season"]) {
          obj.itunes_season = val["itunes:season"];
        }

        if (val["itunes:image"]) {
          obj.itunes_image = val["itunes:image"].href || "";
        }

        if (val["itunes:episode"]) {
          obj.itunes_episode = val["itunes:episode"];
        }

        if (val["itunes:episodeType"]) {
          obj.itunes_episode_type = val["itunes:episodeType"];
        }

        obj.enclosures = val.enclosure ? util.isArray(val.enclosure) ? val.enclosure : [val.enclosure] : [];

        if (val["media:thumbnail"]) {
          obj.media = val.media || {};
          obj.media.thumbnail = val["media:thumbnail"];
          obj.enclosures.push(val["media:thumbnail"]);
        }

        if (val["media:content"]) {
          obj.media = val.media || {};
          obj.media.content = val["media:content"];
          obj.enclosures.push(val["media:content"]);
        }

        if (val["media:group"]) {
          if (val["media:group"]["media:title"]) obj.title = val["media:group"]["media:title"];
          if (val["media:group"]["media:description"]) obj.description = val["media:group"]["media:description"];
          if (val["media:group"]["media:thumbnail"]) obj.enclosures.push(val["media:group"]["media:thumbnail"].url);
        }

        rss.items.push(obj);
      }
    }

    return rss;
  },
  read: function (url, callback) {
    return this.load(url, callback);
  }
};

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "xml2json":
/*!***************************!*\
  !*** external "xml2json" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xml2json");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map