
var miniQuery = function (htmlElement) {

    "use strict";

    var selector = htmlElement;


////////////////////////////////////////
//////////////. Module .////////////////
////////////. MiniHelper .//////////////
////////////////////////////////////////

    var MiniHelper = (function () {
        // console.log("IN MiniHelper");
        var exports = {};

         exports.execute = function(args){
          // console.log("in MiniHelper.execute");
          if (MiniHelper.isMultiple(args.elements)){
            for(var i = args.elements.length; i--;){
              args.callback(args.elements[i], args.callback_args);
            }
          } else {
            args.callback(args.elements, args.callback_args);
          }
          return SweetSelector.select(args.selector)
        }; //end of MiniHelper.execute


        exports.isElement = function (input_element) {
        // console.log("in MiniHelper.isElement");
            if (selector.nodeName !== undefined || (input_element && input_element.nodeName !== undefined)) {
                return true;
            } else {
                return false;
            }
        }; //end of MiniHelper.isElement

        exports.isMultiple = function () {
        // console.log("in MiniHelper.isMultiple");
            if (MiniHelper.isElement()) {
                return htmlElement;
            } else {
                var type = htmlElement.substring(0, 1);
                if (type !== '#') {
                    return htmlElement;
                }
            }
        }; //end of MiniHelper.isMultiple

        return exports;
    })();


    ////////////////////////////////////////
    //////////////. Module .////////////////
    //////////. SweetSelector ./////////////
    ////////////////////////////////////////

    var SweetSelector = (function () {
        // console.log("in SweetSelector");
        var exports = {};

        exports.select = function (htmlElement) {
            if (MiniHelper.isElement(htmlElement)) {
                return htmlElement;
            } else {
                var type = htmlElement.substring(0,1);
                var name = htmlElement.substring(1);
                if (type == '#') {      // id selector
                    return document.getElementById(name);
                }
                else if (type == '.') { // class selector
                    return document.getElementsByClassName(name);
                }
                else {  // better only be a tag
                    return document.getElementsByTagName(htmlElement);
                }
            }
        };

        return exports;
    })(); //end of SweetSelector



    ////////////////////////////////////////
    //////////////. Module .////////////////
    ///////////////. DOM .//////////////////
    ////////////////////////////////////////

    var DOM = (function () {
        // console.log("in DOM");
        var exports = {};

        exports.hide = function (elementToManipulate) {
            elementToManipulate.style.display = 'none';
        };

        exports.show = function (elementToManipulate) {
            elementToManipulate.style.display = '';
        };

        exports.addClass = function (elementToManipulate, klass) {
            var currentClass = elementToManipulate.getAttribute('class') || '';
            var updateClass;
            if (currentClass == '') {
                updateClass = klass;
            } else {
                updateClass = currentClass + " " + klass;
            }
            elementToManipulate.setAttribute('class', updateClass);
        };

        exports.removeClass = function (elementToManipulate, klass) {
            var existingClasses = elementToManipulate.getAttribute('class') || '';
            re = new RegExp("\\s*" + klass + "\\s*", "g");
            var resultingClasses = existingClasses.replace(re, '');
            if (resultingClasses == '') {
                elementToManipulate.removeAttribute('class');
            } else {
                elementToManipulate.setAttribute('class', resultingClasses);
            }
        };

        return exports;
    })(); //end of DOM



    ////////////////////////////////////////
    //////////////. Module .////////////////
    //////////. EventDispatcher .///////////
    ////////////////////////////////////////
    var EventDispatcher = (function () {
        // console.log("in EventDispatcher");
        var exports = {};

        exports.on =  function (target, args) {
            args.callback.bind(target);
            target.addEventListener(args.eventName, args.callback, false);
        };

        exports.trigger =  function (target, args) {
            var event = new Event(args.eventName);
            target.dispatchEvent(event);
        };

        return exports;
    })(); //end of EventDispatcher



    ////////////////////////////////////////
    //////////////. Module .////////////////
    /////////////. AjaxWrap .///////////////
    ////////////////////////////////////////
    var AjaxWrap = (function () {
        // console.log("in AjaxWrapper");
        var exports = {};

        exports.request = function (args) {
            return new Promise(function(resolve, reject){
                var oRequest = new XMLHttpRequest();
                oRequest.open(args.type, args.url);

                oRequest.onload = function(){
                    if (this.status >= 200 && this.status <= 300) {
                        resolve(oRequest.response);
                    } else {
                        reject(oRequest.statusText);
                    }
                };

                if (args.type == 'POST') {
                    oRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                };

                if (args.data == undefined) {
                    oRequest.send();
                } else {
                    oRequest.send(args.data);
                };

                oRequest.onerror = function(){
                    reject(this.statusText);
                };

                oRequest.send(args.data);

            });
        };
        return exports;
    })(); //end of AjaxWrap


    ////////////////////////////////////////
    ////////////. miniQuery .///////////////
    //////////. Module Returns .////////////
    ////////////////////////////////////////
    var exports = SweetSelector.select(selector);

    exports.show = function () {
        return MiniHelper.execute({elements: exports,
            selector: selector,
            callback: DOM.show});
    };

    exports.hide = function () {
        return MiniHelper.execute({elements: exports,
            selector: selector,
            callback: DOM.hide});
    }

    exports.addClass = function (klass) {
        return MiniHelper.execute({elements: exports,
            selector: selector,
            callback: DOM.addClass,
            callback_args: klass});
    }

    exports.removeClass = function (klass) {
        return MiniHelper.execute({elements: exports,
            selector: selector,
            callback: DOM.removeClass,
            callback_args: klass});
    };

    exports.on = function (eventName, callback) {
        return MiniHelper.execute({elements: exports,
            selector: selector,
            callback: EventDispatcher.on,
            callback_args: {selector, eventName, callback}});
    };

    exports.trigger = function (eventName) {
        return MiniHelper.execute({elements: exports,
            selector: selector,
            callback: EventDispatcher.trigger,
            callback_args: {selector, eventName}});
    };

    // exports.ready = function(callback){
    //   if (document.readyState != 'loading'){
    //     callback();
    //   } else {
    //     document.addEventListener('DOMContentReady', callback);
    //   }
    // }

    return exports;

};

// miniQuery.ajax = function(params) {
//   if (params.success === undefined || params.fail === undefined) {
//     return Error('missing success or fail callback');
//   }
//   var success = params.success;
//   var fail = params.fail;
//   var ajaxProm = new Promise(function(resolve, reject) {
//     var req = new XMLHttpRequest();
//     req.open(params.type, params.url);

//     req.onload = function() {
//       if (Math.floor(req.status / 100) == 2) {
//         resolve(req.response);
//       } else {
//         reject(req.statusText);
//       }
//     }

//     if (params.type == 'POST') {
//       req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     }
//     if (params.data === undefined) {
//       req.send();
//     } else {
//       req.send(params.data);
//     }
//   });
//   ajaxProm.then(success).catch(fail);
// }

var $ = miniQuery;

// var a = $("#eyed")
// var b = $(".klass")
// var hovering = function(){console.log("HOVERING!!!")}
