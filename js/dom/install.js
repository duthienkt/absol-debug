import Dom from "absol/src/HTML5/Dom";
import DConsole from "./DConsole";


/**
 * 
 * @param {Dom} core 
 */
export default function install(core){
    core.install([
       DConsole
    ])
}