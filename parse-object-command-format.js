/*:
	@module-configuration:
		{
			"packageName": "parse-object-command-format",
			"fileName": "parse-object-command-format.js",
			"moduleName": "parseObjectCommandFormat",
			"authorName": "Richeve S. Bebedor",
			"authorEMail": "richeve.bebedor@gmail.com",
			"repository": "git@github.com:volkovasystems/parse-object-command-format.git"
		}
	@end-module-configuration

	@module-documentation:
		
	@end-module-documentation

	@include:
	@end-include
*/
var parseObjectCommandFormat = function parseObjectCommandFormat( stringData ){
	//This will separate and extract the object command format tokens.
	var matchList = stringData.match( OBJECT_COMMAND_FORMAT_GREEDY_PATTERN );

	//This will remove excess tokens that is not needed.
	matchList = matchList.join( "[\n]" ).replace( /\t/g, "" ).split( "[\n]" );

	//We need to traverse each object command data to parse JSON data parameters.
	var objectCommandList = [ ];
	var matchListLength = matchList.length;
	var objectCommandData;
	for( var index = 0; index < matchListLength; index++ ){
		//Remove excess spaces at both ends.
		objectCommandData = matchList[ index ].trim( );
		
		//Extract parameter data and command.
		objectCommandData = objectCommandData.match( OBJECT_COMMAND_FORMAT_PATTERN );

		//This is the only hack I can think to separate JSON format strings.
		var parameterData = objectCommandData[ 2 ];
		try{
			parameterData = JSON.parse( parameterData );
		}catch( error ){
			//Remove excess whitespaces for non-JSON strings.
			parameterData = parameterData.replace( /^\s+/gm, "" );
		}

		objectCommandList.push( {
			"command": objectCommandData[ 1 ],
			"parameterData": parameterData
		} );
	}

	return objectCommandList;
};

const OBJECT_COMMAND_FORMAT_GREEDY_PATTERN = /(?:@([a-z][a-z0-9]+(?:-[a-z][a-z0-9]+)*):)\s*([^\b]+?)\s*(?:@end-(?:\1|command))/gm;
const OBJECT_COMMAND_FORMAT_PATTERN = /(?:@([a-z][a-z0-9]+(?:-[a-z][a-z0-9]+)*):)\s*([^\b]+?)\s*(?:@end-(?:\1|command))/;

( module || { } ).exports = parseObjectCommandFormat;
