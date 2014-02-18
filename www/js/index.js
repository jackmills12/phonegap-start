/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var filetext  = "";
var fileEntry;
var fileBinding;


document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

//get access to file and CREATE if does not exists
function gotFS(fileSystem) {
 	fileSystem.root.getFile("test.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

//get file entry
function gotFileEntry(fileEntry) {
	this.fileEntry = fileEntry;
	fileEntry.file(gotFile, fail);
}

//get file itself
function gotFile(file){
	readAsText(file);
}

//READ text from file - assumes that the file contains 
function readAsText(file) {
	var reader = new FileReader();
	
	//this code is run one the file as been completely read
	reader.onloadend = function(evt) {
		
		//store the new string in 'filetext'
		filetext = evt.target.result;
		
		//update the binding 
		fileBinding.set({
			filetext: filetext
		});
    };
	
	//begin reading
   	reader.readAsText(file);
}


//UDPATE file contents - called when submit button is pressed
function writeFile()
{
	fileEntry.createWriter(
		function (writer) { 
			writer.write(filetext);
		}, 
		fail
	);
}

//DELETE file
function deleteFile()
{
	
	fileEntry.remove(
		function () {
			alert("Deleted file");
		}, 
		fail
	);
	
	//reload file system
  	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function fail(error) {
	alert("Cannot use file: " + error.code);
}

//
//RactiveJS 	
//

//binding between variable 'filetext' and the template 
var fileBinding = new Ractive({
	el: 'container',
	template: '#template',
	data: { filetext: filetext}
});


//detects changes in the text box and updates the 'filetext' value with the new value
fileBinding.observe( 'filetext', function ( newValue, oldValue ) {
  filetext = newValue; 
});
