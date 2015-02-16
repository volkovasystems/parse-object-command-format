/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Richeve Siodina Bebedor

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

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
	//: This will separate and extract the object command format tokens.
	var matchList = stringData.match( OBJECT_COMMAND_FORMAT_GREEDY_PATTERN ) || [ ];

	var matchListLength = matchList.length;
	if( matchList === null || matchListLength == 0 ){
		console.warn( "data does not contain any object command formats that can be parsed" );
		console.warn( "parseObjectCommandFormat will not do anything further" );

		return [ ];
	}

	//: This will remove excess tokens that is not needed.
	matchList = matchList.join( "[\n]" ).replace( /\t/g, "" ).split( "[\n]" );

	//: We need to traverse each object command data to parse JSON data parameters.
	var objectCommandList = [ ];

	var objectCommandData;
	for( var index = 0; index < matchListLength; index++ ){
		//: Remove excess spaces at both ends.
		objectCommandData = matchList[ index ].trim( );

		//: Extract parameter data and command.
		objectCommandData = objectCommandData.match( OBJECT_COMMAND_FORMAT_PATTERN );

		//: This is the only hack I can think to separate JSON format strings.
		var parameterData = objectCommandData[ 2 ];
		try{
			parameterData = JSON.parse( parameterData );

		}catch( error ){
			console.warn( "generated an error when parsing an assumed standard JSON data" );
			
			//: Remove excess whitespaces for non-JSON strings.
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

module.exports = parseObjectCommandFormat;
