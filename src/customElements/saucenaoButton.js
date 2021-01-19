
/** A button that opens SauceNAO for a given image URL. */
export class SaucenaoButton extends HTMLElement {
	constructor () {
		super();

		// Create a button
		const button = document.createElement('button');
		button.textContent = 'Get Sauce';

		// Add a click handler to open saucenao
		button.addEventListener('click', event => {
			// Prevent the click from opening the post
			event.stopPropagation();

			// Create a hidden form element we use to trigger the saucenao page
			// (this is necessary because there's no other way to open a new
			// page with a POST request, but that's what they require)
			const hiddenForm = document.createElement('form');
			hiddenForm.action = 'https://saucenao.com/search.php';
			hiddenForm.method = 'POST';
			hiddenForm.target = '_blank';
			hiddenForm.setAttribute('style', 'display: none');

			// Set the image we want to look up in the form
			const urlFormInput = document.createElement('input');
			urlFormInput.type = 'hidden';
			urlFormInput.name = 'url';
			urlFormInput.value = this.imageURL;
			hiddenForm.appendChild(urlFormInput);

			// Submit the form to open the page
			this.shadowRoot.appendChild(hiddenForm);
			hiddenForm.submit();
			this.shadowRoot.removeChild(hiddenForm);
		});

		// Also create a style element
		const style = document.createElement('style');
		style.innerText = `
			button {
				
			}
		`;

		// Display the button
		this.attachShadow({mode: 'open'});
		this.shadowRoot.append(button);
	}

	/** The URL of the image to search for when the button is clicked. */
	get imageURL () {
		return this.getAttribute('image-url');
	}

	set imageURL (value) {
		this.setAttribute('image-url', value);
	}
}

customElements.define('saucenao-button', SaucenaoButton);
