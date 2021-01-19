import {documentLoaded} from './util';

/**
 * A client of Reddit's frontend API (jsAPI). Handles deduplicating frontend
 * events and provides a slightly nicer interface for them.
 */
export default class FrontendAPIClient {
	/**
	 * Creates a client. Remember to call `.listen()`!
	 * @param {string} name Name that identified this client to Reddit
	 */
	constructor ({name}) {
		this.name = name;
		this._listeners = new Map();

		document.addEventListener('reddit', event => {
			const parentElement = event.target;
			let ourElement;
			for (const child of parentElement.childNodes) {
				if (child.getAttribute('data-name') === this.name) {
					ourElement = child;
					break;
				}
			}
			if (!ourElement) {
				console.error('There is no frontend API element for us');
				return;
			}
			if (ourElement.hasAttribute('data-seen')) {
				return;
			}
			ourElement.setAttribute('data-seen', '');
			const {type, data} = event.detail;
			this._emit(type, data, ourElement);
		}, true);
	}

	/**
	 * Registers a listener for the given event type.
	 * @param {string} type
	 * @param {FrontendAPIClient~eventCallback} listener
	 */
	on (type, listener) {
		let listenerList = this._listeners.get(type);
		if (!listenerList) {
			listenerList = [];
			this._listeners.set(type, listenerList);
		}
		listenerList.push(listener);
	}

	/**
	 * Emits an event.
	 * @private
	 * @param {string} type
	 * @param {object} data
	 * @param {Element} element
	 */
	_emit (type, data, element) {
		const listenerList = this._listeners.get(type);
		if (!listenerList) {
			return;
		}
		for (const listener of listenerList) {
			listener(element, data);
		}
	}

	/**
	 * Listener that handles frontend events.
	 * @callback FrontendAPIClient~eventCallback
	 * @param {Element} element An element for our extension that we can add to
	 * @param {object} data Event-specific information about the event
	 */

	/** Registers with the frontend API and starts emitting events. */
	async listen () {
		// Wait for the document to load - otherwise we can't add elements
		await documentLoaded();

		const meta = document.createElement('meta');
		meta.name = 'jsapi.consumer';
		meta.content = this.name;
		document.head.appendChild(meta);
		meta.dispatchEvent(new CustomEvent('reddit.ready'));
	}
}
