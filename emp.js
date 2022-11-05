function uploadnewfile() {
    //Define the folder path to this example.
    var serverRelativeUrlToFolder = "Resume";

    //Get the test values from the input and text input page controls.

    var fileInput = $('#getFile');
     fileName = fileInput[0].files[0].name;
    var fileCount = fileInput[0].files.length;

    //get the serverr url
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
    var filesUploaded =0;
    for(var i=0; i<fileCount; i++)
    {
        //get the local file as an array buffer.
        var getFile = getFileBuffer(i);

        getFile.done(function(arrayBuffer,i){
            // add the file to the sharepoint folder
             var addFile = addFileToFolder(arrayBuffer,i);
              addFile.done(function(){
                filesUploaded++;
                if(fileCount == fielsUploaded){
                    alert("All files uploaded successfully");
                    $("#getfile").value = null;
                    filesUploaded = 0;
                }
            });
            addFile.fail(onerror);
        });
        getFile.fail(onerror);
    }
// get the local file as an array buffer.
function getFileBuffer(i){
     var deferred = jQuery.Deferred();
     var reader =new FileReader();
     reader.onloadend = function(e){
        deferred.resolve(e.target.result, i);
     }
     reader.onerror= function(e){
        deferred.resolve(e.target.error);
}
reader.readAsArrayBuffer(fileInput[0].files[i]);
return deferred.promise();
} 
//add the file to the file collection in the shared documents folder.
function addFileToFolder(arrayBuffer,i){
    var index = i;
    //get the file name from the file input control on the page.
    var fileName = fileInput[0].files[index].name;
    //construct the endpoint.
    var fileCollectionEndpoint = String.format(
        "{0}/_api/web?getfolderbyserverrelativeurl('{1}')/files" + 
        "/add(overwrite=true, url='{2}')",
        serverUrl,serverRelativeUrlToFolder, fileName);
        //send the request and return the response.
        // this call returns the SP file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type : "POST",
            data : arrayBuffer,
            processData : false,
            Headers:{
                "accept" : "application/json;odata=verbose",
                "X-RequesrDigest" : jQuery("#_REQUESTDIGEST").val(),
                "content-length" : arrayBuffer.byteLength
            }         
        });
}
}
 // display error messages
 function onError(error){
    alert(error.responseText);
 }