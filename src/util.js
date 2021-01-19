/** The web extension manifest data. */
export {default as manifest} from './manifest.json';

/**
 * Waits for the document's ready state to become `interactive`.
 * @returns {Promise<void>}
 */
export function documentLoaded () {
	return new Promise(resolve => {
		// If the document is already interactive, don't wait anymore
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			resolve();
			return;
		}

		// State changes only happen once per state, so we don't have to worry
		// about potentially resolving twice
		document.addEventListener('readystatechange', () => {
			if (document.readyState === 'interactive') {
				resolve();
			}
		});
	});
}
