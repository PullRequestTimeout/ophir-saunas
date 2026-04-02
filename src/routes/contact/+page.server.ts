import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		// Submit the form data to the Web3Forms API
		const formData = await event.request.formData();
		//console.log("Form Data:", Object.fromEntries(formData.entries())); // Log form data for debugging

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formData
			});

			if (!response.ok) {
				console.error("Failed to submit form:", response.statusText);
			} else {
				const result = await response.json();
				console.log("Form submitted successfully:", result);
				throw redirect(303, "/contact/success"); // Redirect to a success page after submission
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			throw redirect(303, "/contact/error"); // Redirect to an error page if submission fails
		}
	}
} satisfies Actions;
