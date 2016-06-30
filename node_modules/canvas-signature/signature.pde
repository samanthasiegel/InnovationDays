/*
** @author Eugene Andruszczenko
** @version 0.1
** @date February 12th, 2015
** @description
** signature is a canvas based signature capture tool
** there is a dependency on ProcessingJs library available over CDN //cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.8/processing.min.js
** @html model (include the two lines below in your html page, styles [css] can be added wherever you have your stylesheets, this example is basic)

<div id='signature-container'><canvas data-processing-sources='signature.pde' id='signature'></canvas></div>
<script src='//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.8/processing.min.js'></script>
*/


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


/*
	@method steup
	@description this is the default setup method for processing, sets up size, framerate and invokes additional methods
*/
void setup()
{
	size(w, h);
	smooth();
	frameRate(60);

	image();
	buttons();
	retake();		
}

/*
	@method draw
	@description this is the default draw method for processing, does NOT require redraw (noLoop)
*/
void draw()
{
	noLoop();
}

/*
	@method pen
	@description sets pen color and stroke
*/
void pen()
{
	stroke(signature_color);
	strokeWeight(signature_stroke);
}

/*
	@method image
	@description adds img element to container
*/
void image()
{
	var img = document.createElement('img');
	img.style.width = w;
	img.style.height = h;
	img.style.display = 'none';
	img.setAttribute('id', image_id);

	var canvas = document.getElementById(container_id);
	canvas.appendChild(img);	
}

/*
	@method image
	@description adds button elements to container
*/
void buttons()
{
	var redo = document.createElement('button');
	redo.innerHTML = redo_text;
	redo.addEventListener('click', function(){
		Processing.getInstanceById('signature').retake();
		return false;
	});

	var save = document.createElement('button');
	save.innerHTML = save_text;
	save.addEventListener('click', function(){
		Processing.getInstanceById('signature').capture();
		return false;
	});

	var canvas = document.getElementById(container_id);
	canvas.appendChild(redo);
	canvas.appendChild(save);
}

/*
	@method retake
	@description clears screen and resets helper text
*/
void retake()
{
	var img = document.getElementById(image_id);
	img.style.display = 'none';

	var canvas = document.getElementById(canvas_id);
	canvas.style.display = 'block';

	noStroke();
	fill(255);
	rect(0, 0, w, h);

	fill(helper_text_color);
	textSize(helper_text_size);
	text(helper_text, w/2-50, h/2);

	pen();	

	tap = false;
}

/*
	@method capture
	@description takes image data from canvas and adds to img src attribute
*/
void capture()
{
	noFill();
	stroke(255);
	rect(0, 0, w, h);

	var img = document.getElementById(image_id);
	img.style.display = 'block';
	img.setAttribute('src', document.getElementById('signature').toDataURL());

	var canvas = document.getElementById(canvas_id);
	canvas.style.display = 'none';	

	if(callback)
	{
		window[callback_function]();
	}
}


/*
	mouse
*/

void mouseDragged()
{
	if(!tap)
	{
		fill(255);
		rect(0, 0, w, h);		
		tap = true;
	}
	if(mouseX > 0 && mouseX < w)
	{
		if(mouseY > 0 && mouseY < h)
		{
			line(pmouseX, pmouseY, mouseX, mouseY);
		}	
	}
}