import '../../css/dconsole.css';
import Core from "./Core";
import './DString';
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Dom from "absol/src/HTML5/Dom";

var _ = Core._;
var $ = Core.$

function DConsole() {

}


DConsole.tag = 'dconsole';
DConsole.render = function () {
    return _('div.ad-console');
};

DConsole.prototype._makeEventObject = function (event) {
    var eventObj = EventEmitter.eventProperties.reduce(function (ac, key) {
        var value = event[key];
        if (value !== undefined) {
            ac[key] = value;
        }
        return ac;
    }, {});
    Object.assign(eventObj, event);
    return eventObj;
}

//simple with text
DConsole.prototype._makeViewOf = function (value) {
    if (value === undefined) {
        value = 'undefined';
    }
    else if (value === null) {
        value = "null"
    }
    else if (typeof value == 'string') {

    }
    else if (value.type && value.target) {
        value = this._makeEventObject(value);
    }
    else {
        value = JSON.stringify(value, null, 4);
    }
    console.info(value)
    return _({
        tag: 'dstring',
        props: {
            value: value
        }
    });
};

DConsole.prototype._autoScrollIfNeed = function () {
    var thisDC = this;
    if ((this.offsetHeight + this.scrollTop) >= this.scrollHeight - 20) {
        setTimeout(function () {
            thisDC.scrollTop = thisDC.scrollHeight;
        }, 10);
    }
};

DConsole.prototype.showError = function (error) {
    this._autoScrollIfNeed();
    var logGroup = _({
        class: 'ad-log-error',
        child: [
            {
                tag: 'span',
                class: 'ad-log-error-message',
                child: { text: error.message + '' }
            },
            {
                tag: "span",
                class: 'ad-log-error-at',
                child: { text: ' at ' + error.filename + '<' + error.lineno + ':' + error.colno + '>' }
            },
            {
                class: 'ad-log-error-stack',
                tag: 'div',
                style: { display: 'none' },
                child: { text: error.stack }
            }
        ]
    });
    var displayStack = false;
    var stackElt = $('.ad-log-error-stack', logGroup);
    logGroup.on('click', function () {
        displayStack = !displayStack;
        if (displayStack) {
            stackElt.removeStyle('display');
        }
        else {
            stackElt.addStyle('display', 'none');
        }
    });
    this.addChild(logGroup);
};

DConsole.prototype.log = function () {
    var logGroup = _('.ad-log-group');
    for (var i = 0; i < arguments.length; ++i) {
        logGroup.addChild(this._makeViewOf(arguments[i]));
    }
    this.addChild(logGroup);
};

DConsole.$elt = null;
DConsole.auto = function () {
    if (this.$elt) return;
    var $elt = _({
        tag: 'dconsole',
        class: 'ad-standard-alone'
    });
    this.$shareInstance = $elt;
    console['l' + 'og'] = $elt.log.bind($elt);
    window.addEventListener('error', function (event) {
        $elt.showError({
            lineno: event.lineno,
            colno: event.colno,
            filename: event.source || event.filename,
            stack: event.error.stack,
            message: event.message
        });
    });
    var show = true;
    var $toggleBtn = _({
        tag: 'button',
        class:'ad-console-toggle',
        child: 'span.mdi.mdi-console',
        on: {
            click: function () {
                show = !show;
                if (show) {
                    $elt.removeStyle('display');
                }
                else {
                    $elt.addStyle('display', 'none');
                }
            }
        }
    });
    Dom.documentReady.then(function () {
        $elt.addTo(document.body);
        $toggleBtn.addTo(document.body);
    });

}

Core.install(DConsole);

export default DConsole;