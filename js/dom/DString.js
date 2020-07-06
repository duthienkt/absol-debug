import '../../css/dstring.css';
import Core from "./Core";

var _ = Core._;
var $ = Core.$;


/***
 * @extends HTMLElement
 * @constructor
 */
export default function DString() {
    this.$value = this.firstChild;
    this.value = "";

}

DString.tag = 'dstring';
DString.render = function () {
    return _({
        tag: 'p',
        class: 'ad-string',
        child: { text: '' }
    });
};

DString.property = {};

/***
 *
 * @type {DString}
 */
DString.property.value = {
    set: function (value) {
        this.$value.data = value;
    },
    get: function () {
        return this.$value.data;
    }
};

Core.install(DString);
