import yeet from './FrontendAPIClient';
import {manifest} from './util';
import './customElements/saucenaoButton.js';

// Create a new Reddit frontend client, using the extension name for uniqueness
const client = new yeet({name: manifest.name});

// Add a handler for new reddit posts being added to the interface
client.on('post', (element, data) => {
	// We only care about image posts
	if (!data.media || data.media.type !== 'image') {
		return;
	}

	// Add a saucenao button and point it to the post's image
	const button = document.createElement('saucenao-button');
	button.imageURL = data.media.content;
	element.appendChild(button);
});

// Register with Reddit to receive events
client.listen();
