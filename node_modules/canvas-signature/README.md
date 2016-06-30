# canvas-signature
-----------
##introduction
**canvas-signature** is a canvas based signature capture tool to be used when you need users digital signature on forms. examples would be bank account opening authorization.

### design pattern
**canvas-signature** is built in C++ using the [processingjs](https://processing.org/) library for canvas

### setup
**canvas-signature** requires an arbitraty html element container encapsulating a canvas element .

the canvas element and it's parent require id attributes and can be renamed appropriately as long as they are mapped in the signature.pde file as well

*example:*
<pre>
&lt;div id="signature_container"&gt;
	&lt;canvas data-processing-sources="signature.pde" id="signature"&gt;&lt;/canvas&gt;
&lt;/div&gt;
&lt;script src="//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.8/processing.min.js"&gt;&lt;/script&gt;
</pre>

the **data-processing-sources** attribute of the canvas element is the location of the signature.pde. if you shoved it somewhere else in your directory, map it accordingly.


additionally, you must include the [processingjs](https://processing.org/) library itself. here we use the CDN version from [cdnjs](https://cdnjs.com/)

### signature.pde
this is the core 'sketch' that runs the signature canvas app.
it creates the buttons, image src you need.

additionally, you can set the callback property to true and the callback_function which is invoked after the user clicks save. the example html file simply has a callback that opens a new window with the signature image.. ..to do with as you please.

all parameters are documented for their intended use, customize as you wish.

<pre>
/*
** @param w {int} 
** @description width of desired signature capture canvas
*/
int w = 720;

/*
** @param h {int} 
** @description height of desired signature capture canvas
*/
int h = 240;

/*
** @param canvas_id {string} 
** @description id of canvas element, default is 'signature'
*/
String canvas_id = 'signature';

/*
** @param container_id {string} 
** @description id of div element, default is 'signature_container'
*/
String container_id = 'signature_container';

/*
** @param image_id {string} 
** @description id of output image id, created in this class, can be exported later
*/
String image_id = 'signature_iamge';

/*
** @param redo_text {string} 
** @description string text for the redo button
*/
String redo_text = 'redo';

/*
** @param save_text {string} 
** @description string text for the save button
*/
String save_text = 'save';

/*
** @param helper_text_size {int} 
** @description size of font for helper text
*/
int helper_text_size = 14;

/*
** @param helper_text {string} 
** @description string text for the helper instruction text
*/
String helper_text = 'sign here';

/*
** @param helper_text_color {int} 
** @description grayscale interger for helper text font color (0-255)
*/
String helper_text_color = 203;

/*
** @param signature_color {int} 
** @description grayscale interger for signature pen color (0-255)
*/
String signature_color = 102;

/*
** @param signature_stroke {int} 
** @description size (weight) of pen stroke
*/
String signature_stroke = 3;

/*
** @param tap {boolean} 
** @description if the user has tapped, hide helper text
*/
Boolean tap = false;

/*
** @param callback {boolean} 
** @description if there is a callback function to invoke after save
*/
Boolean callback = true;

/*
** @param callback_function {string} 
** @description string text the callback function to invoke if callback is true
*/
String callback_function = 'savedSignature';
</pre>

make sure you check out the [example page](index.html)