define(['pipAPI', 'https://cdn.jsdelivr.net/gh/iszzycode/implicitbiashiring/NamesTWO.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor();

	return iatExtension({
		category1 : {
			name : 'Aboriginal and Torres Strait Islander Peoples', //Will appear in the data.
			title : {
				media : {word : 'Aboriginal and Torres Strait Islander Peoples'}, //Name of the category presented in the task.
				css : {color:'#31940F','font-size':'1em'}, //Style of the category title.
				height : 4 //Used to position the "Or" in the combined block.
			}, 
			stimulusMedia : [ //Stimuli content as PIP's media objects
    		    {image : 'ATSI face 1.jpg'}, 
    			{image : 'ATSI face 2.jpg'}, 
    			{image : 'ATSI face 3.jpg'}, 
    			{image : 'ATSI face 7.jpg'}, 
    			{image : 'ATSI face 8.jpg'}, 
    			{image : 'ATSI face 9.jpg'}
			], 
			//Stimulus css (style)
			stimulusCss : {color:'#31940F','font-size':'1.8em'}
		},	
		category2 :	{
			name : 'Anglo-Australian people', //Will appear in the data.
			title : {
				media : {word : 'Anglo-Australian people'}, //Name of the category presented in the task.
				css : {color:'#31940F','font-size':'1em'}, //Style of the category title.
				height : 4 //Used to position the "Or" in the combined block.
			}, 
			stimulusMedia : [ //Stimuli content as PIP's media objects
    		    {image : 'anglo face 4.jpg'}, 
    			{image : 'anglo face 5.jpg'}, 
    			{image : 'anglo face 6.jpg'}, 
    			{image : 'Anglo face 10.jpg'}, 
    			{image : 'Anglo face 11.jpg'}, 
    			{image : 'anglo face 12.jpg'}			], 
			//Stimulus css
			stimulusCss : {color:'#31940F','font-size':'1.8em'}
		},	

		base_url : {//Where are your images at?
			image : 'https://iszzycode.github.io/implicitbiashiring/images/'
		} 
	});
});
