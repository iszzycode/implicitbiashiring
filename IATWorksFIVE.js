define(['pipAPI', 'https://cdn.jsdelivr.net/gh/iszzycode/implicitbiashiring/NamesTWO.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor();
/**		
	        **** For Qualtrics		
	        */		
	        API.addSettings('onEnd', window.minnoJS.onEnd);		
	
		
			//For debugging the logger		
			//window.minnoJS.logger = console.log;		
			//window.minnoJS.onEnd = console.log;		
					
	        API.addSettings('logger', {		
	            // gather logs in array		
	            onRow: function(logName, log, settings, ctx){		
	                if (!ctx.logs) ctx.logs = [];		
	                ctx.logs.push(log);		
	            },		
	            // onEnd trigger save (by returning a value)		
	            onEnd: function(name, settings, ctx){		
	                return ctx.logs;		
	            },		
	            // Transform logs into a string		
	            // we save as CSV because qualtrics limits to 20K characters and this is more efficient.		
	            serialize: function (name, logs) {		
	                var headers = ['block', 'trial', 'cond', 'comp', 'type', 'cat',  'stim', 'resp', 'err', 'rt', 'd', 'fb', 'bOrd'];		
	                var myLogs = [];		
	                var iLog;		
	                for (iLog = 0; iLog < logs.length; iLog++)		
	                {		
	                    if(!hasProperties(logs[iLog], ['trial_id', 'name', 'responseHandle', 'stimuli', 'media', 'latency'])){		
	                        // console.log('---MISSING PROPERTIY---');		
	                        // console.log(logs[iLog]);		
	                        // console.log('---MISSING PROPERTIY---');		
	                    }		
	                    else if(!hasProperties(logs[iLog].data, ['block', 'condition', 'score', 'cong']))		
	                    {		
	                        // console.log('---MISSING data PROPERTIY---');		
	                        // console.log(logs[iLog].data);		
	                        // console.log('---MISSING data PROPERTIY---');		
	                    }		
	                    else myLogs.push(logs[iLog]);		
	                    		
	                }		
	                var content = myLogs.map(function (log) { 		
				if(piCurrent.shortData) log = ShortenData(log);		
	                    return [		
	                        log.data.block, //'block'		
	                        log.trial_id, //'trial'		
	                        log.data.condition, //'cond'		
	                        log.data.cong, //'comp'		
	                        log.name, //'type'		
	                        log.stimuli[0], //'cat'		
	                        log.media[0], //'stim'		
	                        log.responseHandle, //'resp'		
	                        log.data.score, //'err'		
	                        log.latency, //'rt'		
	                        '', //'d'		
	                        '', //'fb'		
	                        '' //'bOrd'		
	                        ]; 		
			});		
	                //Add a line with the feedback, score and block-order condition		
	                content.push([		
	                            9, //'block'		
	                            999, //'trial'		
	                            'end', //'cond'		
	                            '', //'comp'		
	                            '', //'type'		
	                            '', //'cat'		
	                            '', //'stim'		
	                            '', //'resp'		
	                            '', //'err'		
	                            '', //'rt'		
	                            piCurrent.d, //'d'		
	                            piCurrent.feedback, //'fb'		
	                            block3Cond //'bOrd'		
	                        ]);		
	                        		
	                content.unshift(headers);		
	                return toCsv(content);		
			    		
			function ShortenData(log){		
				var att1 = piCurrent.attribute1;		
				var att2 = piCurrent.attribute2;		
				var cat1 = piCurrent.category1;		
				var cat2 = piCurrent.category2;		
						
				var name = [att1.name, att2.name, cat1.name, cat2.name];		
				var nameReplace = ['att1','att2','cat1','cat2'];		
				//replace log.stimuli[0]		
				var index = name.indexOf(log.stimuli[0]);		
				log.stimuli[0] = nameReplace[index];		
				//replace log.data.condition		
				var condA = log.data.condition.split(',')[0];		
				var condB = log.data.condition.split(',')[1];			
				log.data.condition = nameReplace[name.indexOf(condA.split('/')[0])]+'/'+nameReplace[name.indexOf(condA.split('/')[1])]+		
					','+nameReplace[name.indexOf(condB.split('/')[0])]+'/'+nameReplace[name.indexOf(condB.split('/')[1])];		
				//replace log.media[0]		
				var allLists = [att1.stimulusMedia, att2.stimulusMedia, cat1.stimulusMedia, cat2.stimulusMedia];		
				var stimuliList = allLists[index].map(object => object.image || object.word);		
				var indexStimulus = stimuliList.indexOf(log.media[0]); //stimulus index in it's stimuli array		
				if (index === 0) log.media[0] = 'a'+'1'+'s'+(indexStimulus+1);		
				if (index === 1) log.media[0] = 'a'+'2'+'s'+(indexStimulus+1);		
				if (index === 2) log.media[0] = 'c'+'1'+'s'+(indexStimulus+1);		
				if (index === 3) log.media[0] = 'c'+'2'+'s'+(indexStimulus+1);		
						
				return log;		
			}		
	
		
	                function hasProperties(obj, props) {		
	                    var iProp;		
	                    for (iProp = 0; iProp < props.length; iProp++)		
	                    {		
	                        if (!obj.hasOwnProperty(props[iProp]))		
	                        {		
	                           // console.log('missing ' + props[iProp]);		
	                            return false;		
	                        }		
	                    }		
	                    return true;		
	                }		
	                function toCsv(matrice) { return matrice.map(buildRow).join('\n'); }		
	                function buildRow(arr) { return arr.map(normalize).join(','); }		
	                // wrap in double quotes and escape inner double quotes		
	                function normalize(val) {		
	                    var quotableRgx = /(\n|,|")/;		
	                    if (quotableRgx.test(val)) return '"' + val.replace(/"/g, '""') + '"';		
	                    return val;		
	                }		
	            },		
	            // Set logs into an input (i.e. put them wherever you want)		
	            send: function(name, serialized){		
			// The limit on qualtricks is 20k, we want to be safe		
			if (serialized.length >= 18000){		
				console.warn('Data are too long for Qualtrics. Consider setting the parameter shortData to true');		
			    if(piCurrent.alertIfDataMaxedOut === true)		
				    alert('Data are too long for Qualtrics. Consider setting the parameter shortData to true');		
			}		
	                window.minnoJS.logger(serialized);		
	            }		
	        });		

    return iatExtension({
        category1 : {
            name : 'Aboriginal and Torres Strait Islander Peoples', //Will appear in the data.
            title : {
                media : {word : 'Aboriginal and Torres Strait Islander Peoples'}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'2em'}, //Style of the category title.
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
                css : {color:'#31940F','font-size':'2em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image : 'anglo face 4.jpg'}, 
                {image : 'anglo face 5.jpg'}, 
                {image : 'anglo face 6.jpg'}, 
                {image : 'Anglo face 10.jpg'}, 
                {image : 'Anglo face 11.jpg'}, 
                {image : 'anglo face 12.jpg'}
            ], 
            //Stimulus css
            stimulusCss : {color:'#31940F','font-size':'1.8em'}
        },	

        base_url : {//Where are your images at?
            image : 'https://iszzycode.github.io/implicitbiashiring/images/'
        } 
    });
});

