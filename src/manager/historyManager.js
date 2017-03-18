//@flow
import _ from 'lodash';
import EventEmitter from 'events';

type pageHistoryState = {|
		page: number;
|};

type historyState = pageHistoryState;

//flow type
interface historyManagerBase{
	push(state: historyState, title: ?string, url: ?string): void;
	replace(state: historyState, title: ?string, url: ?string) :void;
	historyStack: Array<Object>;
	currentState: Object;
}
type historyManagerDuck = historyManagerBase & events$EventEmitter;


let historyStack: Array<Object> = [];
let currentState: Object = {};

//=========== main ===============
const historyManager: historyManagerDuck = _.extend( new EventEmitter(), {
	getHistoryStack: () => historyStack,
	getCurrentState: () => currentState,
	pushState: (state: historyState, title: ?string = '', url: ?string = '') =>{
		currentState = _.extend(currentState, state);
		historyStack.push(state);
		window.history.pushState(state, title, url);
	},
	replaceState: (state: historyState, title: ?string = '', url: ?string = '') => {
		currentState = _.extend(currentState, state);
		window.history.replaceState(currentState, title, url);
	},
	onHistoryChange: ({state}) =>{
		currentState = _.extend(currentState, state);
		historyManager.emit('history_change', currentState);
	},
});

window.addEventListener('popstate', historyManager.onHistoryChange);

export default historyManager;
