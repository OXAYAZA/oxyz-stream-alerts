async function get ( url ) {
	let response = await fetch( url );
	if ( response.ok ) return await response.json();
	else return {};
}

export default { get };
