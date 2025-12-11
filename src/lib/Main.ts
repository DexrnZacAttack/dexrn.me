import { I18N } from '$lib/i18n/I18N';
import { waitLocale } from 'svelte-i18n';

export async function main() {
	I18N.init();
	await waitLocale();
}
