//var displayOptions;
var displayOptions = {};
function dvf_display (json,value1,value2,max,min,check_choice,value3)
{
	if (value2=="GKZ"){
		check_choice="GKZ";
	}

	if (value2=="Values"){
		check_choice="Air Quality-Branch:"+branch_selection+"-Substance:"+substance_selection;
	}



/* Alternative for min/max

var range = L.Util.getNumericRange(countyStats, field);

*/

	displayOptions = {};
	var colorFunction = new L.HSLHueFunction(new L.Point(min, 60), new L.Point(max, 0), {outputSaturation: '100%', outputLuminosity: '25%'});
	var fillColorFunction = new L.HSLHueFunction(new L.Point(min, 60), new L.Point(max, 0), {outputSaturation: '100%', outputLuminosity: '50%'});
	var text=value1+'.'+value2;
	var text2=value1+'.'+value3;
	var text3=text+'/'+text2;
	//alert(text3);
	text=text.toString();
	//text2=text2.toString();

		displayOptions[text]= {
							
					displayName: check_choice,
					color: colorFunction,
					fillColor: fillColorFunction
				
		},
		displayOptions[text2]= {
							
					displayName: 'Name'
					
					
				
		};
		
		return displayOptions; 
	
}