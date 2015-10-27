var SIRLayer = new L.LayerGroup();
var info_check
info_check=false;
var legend_check
legend_check=false;
var sir_check
var div2 = L.DomUtil.create('div2', 'info legend');
info_div = L.DomUtil.create('div', 'info');
var minimum=0;
var maximum=230;
var check_choice2;
var legend2
var check_choice_label;
var geojson22;
var geojsonadd2;
var chart_values=[];
var chart_elements=[];










/*
function draw_chart () {
 var ctx = document.getElementById("myChart").getContext("2d");
            window.myBar = new Chart(ctx).Bar(barChartData, {
                responsive : true
            });
}	


//Chart


var colors = [];
colors.push(                        
{
        fillColor : "rgba(95,137,250,0.5)",
        strokeColor : "rgba(95,137,250,0.9)",
        highlightFill: "rgba(95,137,250,0.75)",
        highlightStroke: "rgba(95,137,250,1)"
});
colors.push(                        
{
        fillColor : "rgba(245,75,75,0.5)",
        strokeColor : "rgba(245,75,75,0.8)",
        highlightFill : "rgba(245,75,75,0.75)",
        highlightStroke : "rgba(245,75,75,1)"
});
colors.push(                        
{
        fillColor : "rgba(98,223,114,0.5)",
        strokeColor : "rgba(98,223,114,0.8)",
        highlightFill : "rgba(98,223,114,0.75)",
        highlightStroke : "rgba(98,223,114,1)",
});	

	// chart
	// extract labels from table
	function generateLabelsFromTable()
{                       
    var labels = [];

    var rows = jQuery("tr");
    rows.each(function(index){
        if (index != 0)  // we dont need first row of table
        {
            var cols = $(this).find("td");      
            labels.push(cols.first().text());                           
        }
    });
    return labels;
}
	
	//generate chart data by iterating the table html
	
	function generateDataSetsFromTable()
{
    var data;
    var datasets = [];
    var rows = jQuery("tr");
    rows.each(function(index){
        if (index != 0) // we dont need first row of table
        {
            var cols = $(this).find("td");  
            var data = [];
            cols.each(function(innerIndex){
                if (innerIndex!=0) // we dont need first columns of the row                 
                    data.push($(this).text());                                          
            });


            var dataset = 
            {
                fillColor : colors[index%3].fillColor,
                strokeColor : colors[index%3].strokeColor,
                highlightFill: colors[index%3].highlightFill,
                highlightStroke: colors[index%3].highlightStroke,
                data : data
            }

            datasets.push(dataset);

        }
    });
    return datasets;
}

var barChartData = {
    labels : generateLabelsFromTable(),
    datasets : generateDataSetsFromTable()
}; 
	

*/





function precise_round(num, decimals) {
var t=Math.pow(10, decimals);   
 return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
    }




 function decode_utf8(utftext) {
            var plaintext = ""; var i=0; var c=c1=c2=0;
             // while-Schleife, weil einige Zeichen uebersprungen werden
             while(i<utftext.length)
                 {
                 c = utftext.charCodeAt(i);
                 if (c<128) {
                     plaintext += String.fromCharCode(c);
                     i++;}
                 else if((c>191) && (c<224)) {
                     c2 = utftext.charCodeAt(i+1);
                     plaintext += String.fromCharCode(((c&31)<<6) | (c2&63));
                     i+=2;}
                 else {
                     c2 = utftext.charCodeAt(i+1); c3 = utftext.charCodeAt(i+2);
                     plaintext += String.fromCharCode(((c&15)<<12) | ((c2&63)<<6) | (c3&63));
                     i+=3;}
                 }
             return plaintext;
         }
// function to visualize chloropleth SIR/CI map

function visualize_sir (sir_cancer,sir_cancer_add,sir_year,sir_gender,check_choice,cancer_type_name,mapname,search_substance)
{

//alert(sir_cancer+" "+sir_cancer_add+" "+sir_year+" "+sir_gender+" "+check_choice+" "+cancer_type_name+" "+mapname+" "+search_substance);
if (check_choice!="Soildata"){
	//map.removeLayer(electoralVotesLayer);
		//check multiple queries
		if (querynumber==1){
			if (secondquery==true){
			if (info_check==true){
				 info.removeFrom(map)
				 info_check=false;
			}
			}
		}
}
		// connect to endpoint and send sparql query
//var endpoint="http://www.friedrichmueller-gi.de:8181/parliament/sparql";
var endpoint="http://friedrichmueller-gi.de:8080/openrdf-sesame/repositories/CancerData2";
				//var endpoint="http://giv-lodumdata.uni-muenster.de:8080/openrdf-workbench/repositories/cancerdata/";
				//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
				var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
				var request = { accept : 'application/sparql-results+json' };

				
				//get sparql query from textarea
				//request.query=$("#sparqlQuery").val();
				if (check_choice=="SIR"){
				check_choice_label="SIR";
					request.query=" Select ?Label ?SIR ?GKZ   WHERE {?Municipality  <http://www.example.org/def/"+sir_cancer+"_"+sir_year+"_"+sir_gender+"_SIR> ?SIR.?Municipality <http://www.example.org/def/MunicipalityName> ?Label. ?Municipality <http://www.example.org/def/GKZ> ?GKZ.}";
		}

				if (check_choice=="CI_lower_level"){
				check_choice_label="CI_lower_level";
				if (sir_cancer=="C00-C14"){
				sir_cancer="C00C14"
				}
				if (sir_cancer=="C91-C95"){
				sir_cancer="C91C95"
				}
				
					request.query="PREFIX qb:<http://purl.org/linked-data/cube#> Select   ?GKZ ?CI_lower_level   ?Label  FROM <http://www.friedrichmueller-gi.de:8080/context/cancerdata/CI95> WHERE { ?Municipality <http://www.example.org/def/GKZ> ?GKZ. ?Municipality <http://www.example.org/def/Cancer> \""+sir_cancer+sir_year+sir_gender+"\" . ?Municipality  <http://www.example.org/def/CI_lowerlimit> ?CI_lower_level   . ?Municipality <http://www.example.org/def/Municipality> ?Label. } "; //Limit 20
		}

				if (check_choice=="CI_upper_level"){
				check_choice_label="CI_upper_level";
				if (sir_cancer=="C00-C14"){
				sir_cancer="C00C14"
				}
				if (sir_cancer=="C91-C95"){
				sir_cancer="C91C95"
				}
					request.query="PREFIX qb:<http://purl.org/linked-data/cube#> Select DISTINCT ?Label ?GKZ ?CI_upper_level  FROM <http://www.friedrichmueller-gi.de:8080/context/cancerdata/CI95> WHERE {?Municipality <http://www.example.org/def/Cancer> \""+sir_cancer+sir_year+sir_gender+"\" .?GKZURL 	qb:structure ?Municipality. ?Municipality <http://www.example.org/def/Municipality> ?Label. ?Municipality <http://www.example.org/def/GKZ> ?GKZ. ?Municipality  <http://www.example.org/def/CI_upperlimit> ?CI_upper_level   } "; //Limit 20
		//alert(sir_cancer+sir_year+sir_gender);
		}

				if (check_choice=="Carcinogen"){
					request.query="PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#> Select DISTINCT ?a  WHERE {?a a <http://www.example.org/Carcinogenes_"+sir_cancer+sir_cancer_add+"> } "; //Limit 20
		}

				if (check_choice=="Emitter"){
			
// info.removeFrom(map);
					//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> Select DISTINCT  ?Emitter ?Attribute ?Value WHERE {?Emitter qb:dataSet <http://www.example.org/dataset/Muenster_IndustryEmitterDataset>. ?Emitter ?Attribute ?Value}"; //Limit 20
					//emitter_content=emitter_name3+"xxxxx"+emitter_N2O+"xxxxx"+emitter_emission+"xxxxx"+emitter_CO2+"xxxxx"+emitter_CH4+"xxxxx"+emitter_NH3+"xxxxx"+emitter_HCL+"xxxxx"+emitter_HF+"xxxxx"+emitter_CO+"xxxxx"+emitter_NMVOC+"xxxxx"+emitter_SO2+"xxxxx"+emitter_NO2+"xxxxx"+emitter_As+"xxxxx"+emitter_Pb+"xxxxx"+emitter_Cr+"xxxxx"+emitter_Cu+"xxxxx"+emitter_Cd+"xxxxx"+emitter_Ni+"xxxxx"+emitter_V+"xxxxx"+emitter_Zn+"xxxxx"+emitter_DUF+"xxxxx"+emitter_BAP+"xxxxx"+emitter_BENZ+"xxxxx"+emitter_PAK+"xxxxx"+emitter_PM10+"xxxxx"+emitter_Staub+"xxxxx"+emitter_RUSS+"xxxxx"+emitter_Street+"xxxxx"+emitter_ZipCodeCity;
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter ?GKZ ?LAT ?Long ?EmissionProcess ?N2O ?LAT ?Long ?Name ?Street ?Zip ?CO2 ?CH4 ?NH3 ?HCL ?HF ?CO ?NMVOC ?SO2 ?NO2 ?As ?Pb ?Cr ?Cu ?Cd ?Ni ?V ?Zn ?DUF ?BAP ?BENZ ?PAK ?PM10 ?Staub ?RUSS FROM <file://Emitter_detail_all%20.rdf> WHERE { ?Emitter <http://www.example.org/def/GKZ> ?GKZ.FILTER\(?GKZ= \"5515000\"\).?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS} LIMIT 400";
		
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter ?GKZ   ?LAT ?Long ?EmissionProcess ?N2O ?Name ?Street ?Zip ?CO2 ?CH4 ?NH3 ?HCL ?HF ?CO ?NMVOC ?SO2 ?NO2 ?As ?Pb ?Cr ?Cu ?Cd ?Ni ?V ?Zn ?DUF ?BAP ?BENZ ?PAK ?PM10 ?Staub ?RUSS FROM <file://Emitter_detail_all%20.rdf> WHERE { ?Emitter <http://www.example.org/def/GKZ> \""+emitterdata_municipality+"\".?Emitter <http://www.example.org/def/GKZ> ?GKZ. ?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS.}GROUP BY ?Emitter LIMIT 400";
		
		request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter ?EmissionProcess ?N2O ?LAT ?Long ?Name ?Street ?Zip ?CO2 ?CH4 ?NH3 ?HCL ?HF ?CO ?NMVOC ?SO2 ?NO2 ?As ?Pb ?Cr ?Cu ?Cd ?Ni ?V ?Zn ?DUF ?BAP ?BENZ ?PAK ?PM10 ?Staub ?RUSS FROM <http://www.friedrichmueller-gi.de:8080/context/cancerdata/EmitterDetaiMuenster2> WHERE { ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS}";
		
		
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter  (SAMPLE (?GKZ) AS ?GKZ)   (SAMPLE (?LAT) AS ?LAT)  (SAMPLE (?Long)AS?Long) (SAMPLE (?EmissionProcess) AS ?EmissionProcess)  (SAMPLE (?N2O) AS ?N2O)  (SAMPLE (?Name) AS ?Name)  (SAMPLE (?Street) AS ?Street)  (SAMPLE (?Zip) AS ?Zip)  (SAMPLE (?CO2) AS ?CO2)  (SAMPLE (?CH4) AS ?CH4)  (SAMPLE (?NH3) AS ?NH3)  (SAMPLE (?HCL) AS ?HCL)  (SAMPLE (?HF) AS ?HF)  (SAMPLE (?CO) AS ?CO)  (SAMPLE (?NMVOC) AS ?NMVOC)  (SAMPLE (?SO2) AS ?SO2)  (SAMPLE (?NO2) AS ?NO2)  (SAMPLE (?As) AS ?As)  (SAMPLE (?Pb) AS ?Pb)  (SAMPLE (?Cr) AS ?Cr)  (SAMPLE (?Cu) AS ?Cu)  (SAMPLE (?Cd) AS ?Cd)  (SAMPLE (?Ni) AS ?Ni)  (SAMPLE (?V) AS ?V)  (SAMPLE (?Zn) AS ?Zn)  (SAMPLE (?DUF) AS ?DUF)  (SAMPLE (?BAP) AS ?BAP)  (SAMPLE (?BENZ) AS ?BENZ)  (SAMPLE (?PAK) AS ?PAK)  (SAMPLE (?PM10) AS ?PM10)  (SAMPLE (?Staub) AS ?Staub)  (SAMPLE (?RUSS) AS ?RUSS) FROM <file://Emitter_detail_all%20.rdf> WHERE { {?Emitter <http://www.example.org/def/GKZ> \""+emitterdata_municipality+"\".?Emitter <http://www.example.org/def/GKZ> ?GKZ.FILTER(?GKZ= \""+emitterdata_municipality+"\"). ?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS.FILTER(?GKZ= \""+emitterdata_municipality+"\")}}GROUP BY ?Emitter ";
		
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter  (SAMPLE (?GKZ) AS ?GKZ)   (SAMPLE (?LAT) AS ?LAT)  (SAMPLE (?Long)AS?Long) (SAMPLE (?EmissionProcess) AS ?EmissionProcess)  (SAMPLE (?N2O) AS ?N2O)  (SAMPLE (?Name) AS ?Name)  (SAMPLE (?Street) AS ?Street)  (SAMPLE (?Zip) AS ?Zip)  (SAMPLE (?CO2) AS ?CO2)  (SAMPLE (?CH4) AS ?CH4)  (SAMPLE (?NH3) AS ?NH3)  (SAMPLE (?HCL) AS ?HCL)  (SAMPLE (?HF) AS ?HF)  (SAMPLE (?CO) AS ?CO)  (SAMPLE (?NMVOC) AS ?NMVOC)  (SAMPLE (?SO2) AS ?SO2)  (SAMPLE (?NO2) AS ?NO2)  (SAMPLE (?As) AS ?As)  (SAMPLE (?Pb) AS ?Pb)  (SAMPLE (?Cr) AS ?Cr)  (SAMPLE (?Cu) AS ?Cu)  (SAMPLE (?Cd) AS ?Cd)  (SAMPLE (?Ni) AS ?Ni)  (SAMPLE (?V) AS ?V)  (SAMPLE (?Zn) AS ?Zn)  (SAMPLE (?DUF) AS ?DUF)  (SAMPLE (?BAP) AS ?BAP)  (SAMPLE (?BENZ) AS ?BENZ)  (SAMPLE (?PAK) AS ?PAK)  (SAMPLE (?PM10) AS ?PM10)  (SAMPLE (?Staub) AS ?Staub)  (SAMPLE (?RUSS) AS ?RUSS) FROM <file://Emitter_detail_all%20.rdf> WHERE { {?Emitter <http://www.example.org/def/GKZ> \""+emitterdata_municipality+"\".?Emitter <http://www.example.org/def/GKZ> ?GKZ.FILTER(?GKZ= \""+emitterdata_municipality+"\"). ?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS.FILTER(?GKZ= \""+emitterdata_municipality+"\")}}GROUP BY ?Emitter ";
		
		
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT   ?Emitter  ?GKZ    (SAMPLE (?LAT) AS ?LAT)  (SAMPLE (?Long)AS?Long) (SAMPLE (?EmissionProcess) AS ?EmissionProcess)  (SAMPLE (?N2O) AS ?N2O)  (SAMPLE (?Name) AS ?Name)  (SAMPLE (?Street) AS ?Street)  (SAMPLE (?Zip) AS ?Zip)  (SAMPLE (?CO2) AS ?CO2)  (SAMPLE (?CH4) AS ?CH4)  (SAMPLE (?NH3) AS ?NH3)  (SAMPLE (?HCL) AS ?HCL)  (SAMPLE (?HF) AS ?HF)  (SAMPLE (?CO) AS ?CO)  (SAMPLE (?NMVOC) AS ?NMVOC)  (SAMPLE (?SO2) AS ?SO2)  (SAMPLE (?NO2) AS ?NO2)  (SAMPLE (?As) AS ?As)  (SAMPLE (?Pb) AS ?Pb)  (SAMPLE (?Cr) AS ?Cr)  (SAMPLE (?Cu) AS ?Cu)  (SAMPLE (?Cd) AS ?Cd)  (SAMPLE (?Ni) AS ?Ni)  (SAMPLE (?V) AS ?V)  (SAMPLE (?Zn) AS ?Zn)  (SAMPLE (?DUF) AS ?DUF)  (SAMPLE (?BAP) AS ?BAP)  (SAMPLE (?BENZ) AS ?BENZ)  (SAMPLE (?PAK) AS ?PAK)  (SAMPLE (?PM10) AS ?PM10)  (SAMPLE (?Staub) AS ?Staub)  (SAMPLE (?RUSS) AS ?RUSS) FROM <file://Emitter_detail_all%20.rdf> WHERE {?Emitter qb:dataset ?a.  VALUES ?GKZ {\""+emitterdata_municipality+"\"}. ?Emitter <http://www.example.org/def/GKZ> ?GKZ. ?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS.}GROUP BY ?Emitter ?GKZ ";
		
		
		
		
		
		
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter ?GKZ   ?LAT ?Long ?EmissionProcess ?N2O ?Name ?Street ?Zip ?CO2 ?CH4 ?NH3 ?HCL ?HF ?CO ?NMVOC ?SO2 ?NO2 ?As ?Pb ?Cr ?Cu ?Cd ?Ni ?V ?Zn ?DUF ?BAP ?BENZ ?PAK ?PM10 ?Staub ?RUSS FROM <file://Emitter_detail_all%20.rdf> WHERE {{ ?Emitter <http://www.example.org/def/GKZ> ?GKZ. FILTER(?GKZ= \""+emitterdata_municipality+"\")}UNION{?Emitter <http://www.example.org/def/Lat> ?LAT.?Emitter <http://www.example.org/def/Long> ?Long.?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS.}} LIMIT 400";
		
		//request.query="PREFIX qb:<http://purl.org/linked-data/cube#> SELECT DISTINCT  ?Emitter ?GKZ   ?LAT ?Long ?EmissionProcess ?N2O ?Name ?Street ?Zip ?CO2 ?CH4 ?NH3 ?HCL ?HF ?CO ?NMVOC ?SO2 ?NO2 ?As ?Pb ?Cr ?Cu ?Cd ?Ni ?V ?Zn ?DUF ?BAP ?BENZ ?PAK ?PM10 ?Staub ?RUSS FROM <file://Emitter_detail_all%20.rdf> WHERE { ?Emitter <http://www.example.org/def/GKZ> \""+emitterdata_municipality+"\". ?Emitter <http://www.example.org/def/Lat> ?LAT. ?Emitter <http://www.example.org/def/Long> ?Long. ?Emitter <http://www.example.org/def/EmissionProcess> ?EmissionProcess. ?Emitter <http://www.example.org/def/N2O> ?N2O. ?Emitter <http://www.example.org/def/Name> ?Name. ?Emitter <http://www.example.org/def/Street> ?Street. ?Emitter <http://www.example.org/def/ZipCodeCity> ?Zip. ?Emitter <http://www.example.org/def/CO2> ?CO2. ?Emitter <http://www.example.org/def/CH4> ?CH4. ?Emitter <http://www.example.org/def/NH3> ?NH3. ?Emitter <http://www.example.org/def/HCL> ?HCL . ?Emitter <http://www.example.org/def/HF> ?HF. ?Emitter <http://www.example.org/def/CO> ?CO. ?Emitter <http://www.example.org/def/NMVOC> ?NMVOC. ?Emitter <http://www.example.org/def/SO2> ?SO2. ?Emitter <http://www.example.org/def/NO2> ?NO2. ?Emitter <http://www.example.org/def/As> ?As. ?Emitter <http://www.example.org/def/Pb> ?Pb. ?Emitter <http://www.example.org/def/Cr> ?Cr. ?Emitter <http://www.example.org/def/Cu> ?Cu. ?Emitter <http://www.example.org/def/Cd> ?Cd. ?Emitter <http://www.example.org/def/Ni> ?Ni. ?Emitter <http://www.example.org/def/V> ?V. ?Emitter <http://www.example.org/def/Zn> ?Zn. ?Emitter <http://www.example.org/def/DUF> ?DUF. ?Emitter <http://www.example.org/def/BAP> ?BAP. ?Emitter <http://www.example.org/def/BENZ> ?BENZ. ?Emitter <http://www.example.org/def/PAK> ?PAK. ?Emitter <http://www.example.org/def/PM10> ?PM10. ?Emitter <http://www.example.org/def/Staub> ?Staub. ?Emitter <http://www.example.org/def/RUSS> ?RUSS.FILTER(?GKZ= \""+emitterdata_municipality+"\")}";
		
		
		
		
		}
		
		if (check_choice=="Accident"){

					request.query="PREFIX qb:<http://purl.org/linked-data/cube#> Select DISTINCT  ?incident ?type ?zipcode ?street ?GKZ ?municipality ?faultypart ?operationprocess ?cause ?causestatus ?eps ?sdd ?year ?lat ?long FROM <http://www.friedrichmueller-gi.de:8080/context/cancerdata/IndustrialAccidentExample> WHERE {?a <http://www.example.org/def/Incident> ?incident.?a <http://www.example.org/def/Type> ?type.?a <http://www.example.org/def/ZipCode> ?zipcode.?a <http://www.example.org/def/Street> ?street.?a <http://www.example.org/def/GKZ> ?GKZ.?a <http://www.example.org/def/Municipality> ?municipality.?a <http://www.example.org/def/FaultyPart> ?faultypart.?a <http://www.example.org/def/OperationProcess> ?operationprocess.?a <http://www.example.org/def/Cause> ?cause.?a <http://www.example.org/def/CauseStatus> ?causestatus.?a <http://www.example.org/def/EnvironmentalPollutionStatus> ?eps.?a <http://www.example.org/def/StatusDiverseDisturbences> ?sdd.?a <http://www.example.org/def/Year> ?year.?a <http://www.example.org/def/Y> ?lat.?a <http://www.example.org/def/X> ?long.}"; //Limit 20
		}
		
		if (check_choice=="Accident_detail"){

					request.query="PREFIX qb:<http://purl.org/linked-data/cube#> Select DISTINCT ?a ?substance ?incident ?value_kg ?value_text ?value_description  WHERE {?a <http://www.example.org/def/X> ?c. ?a <http://www.example.org/def/Substance> ?substance. ?a <http://www.example.org/def/Incident> ?incident. ?a <http://www.example.org/def/Value_kg> ?value_kg. ?a <http://www.example.org/def/Value_text> ?value_text.OPTIONAL{?a <http://www.example.org/def/Value_description> ?value_description}}";
		}
		
		
		if(check_choice=="Soildata"){
		
		//alert(soildata_municipality); 
					//request.query="SELECT ?Instance ?typeofuse ?substance  ?value ?municipality ?GKZ ?paramnr ?probenr ?seqnr ?probemethod ?etrskm32E ?etrskm32N ?X ?Y ?typeofsoil ?soiltype ?locationid ?unit ?municipality WHERE { ?Instance <http://www.example.org/def/UseType> ?typeofuse. ?Instance <http://www.example.org/def/Substance> ?substance.?Instance <http://www.example.org/def/Value> ?value.?Instance <http://www.example.org/def/Municipality> ?municipality.?Instance <http://www.example.org/def/GKZ> ?GKZ.?Instance <http://www.example.org/def/ParamNR> ?paramnr.?Instance <http://www.example.org/def/ProbeNR> ?probenr.?Instance <http://www.example.org/def/SeqNr> ?seqnr.?Instance <http://www.example.org/def/ProbeMethod> ?probemethod.?Instance <http://www.example.org/def/EtrsKm32E> ?etrskm32E.?Instance <http://www.example.org/def/EtrsKm32N> ?etrskm32N.?Instance <http://www.example.org/def/X> ?X.?Instance <http://www.example.org/def/Y> ?Y.?Instance <http://www.example.org/def/TypeOfSoil> ?typeofsoil.?Instance <http://www.example.org/def/SoilType> ?soiltype.?Instance <http://www.example.org/def/LocationID> ?locationid.?Instance <http://www.example.org/def/Unit> ?unit.?Instance <http://www.example.org/def/Municipality> ?municipality}LIMIT 2000";
		//console.log(soildata_municipality);
		
		request.query="SELECT DISTINCT  ?Instance ?GKZ   ?X ?Y   ?unit ?Coordinates ?Substance ?ID ?Value ?municipality FROM <http://www.friedrichmueller-gi.de:8080/context/cancerdata/Soildata>   WHERE {?Instance <http://www.example.org/def/GKZ> ?GKZ.FILTER(?GKZ= \""+soildata_municipality+"\"). ?Instance <http://www.example.org/def/X> ?X.?Instance <http://www.example.org/def/Y> ?Y.?Instance <http://www.example.org/def/Unit> ?unit.?Instance <http://www.example.org/def/Coordinates> ?Coordinates.?Instance <http://www.example.org/def/Substance> ?Substance.?Instance <http://www.example.org/def/LocationID> ?ID.?Instance <http://www.example.org/def/Value> ?Value.?Instance <http://www.example.org/def/Municipality> ?municipality.}LIMIT 1000";
		//request.query="SELECT DISTINCT ?Instance   ?X ?Y   ?unit ?Coordinates ?Substance ?ID ?Value ?municipality WHERE {?Instance <http://www.example.org/def/GKZ> \""+soildata_municipality+"\";<http://www.example.org/def/X> ?X;<http://www.example.org/def/Y> ?Y;<http://www.example.org/def/Unit> ?unit;<http://www.example.org/def/Coordinates> ?Coordinates;<http://www.example.org/def/Substance> ?Substance;<http://www.example.org/def/LocationID> ?ID;<http://www.example.org/def/Value> ?Value;<http://www.example.org/def/Municipality> ?municipality.}LIMIT 1000";
		//
		check_choice2=check_choice;
		
		}
		
		
		
		
		
	
				//sent request
				$.ajax({
					dataType: "jsonp",
					//some sparql endpoints do only support "sparql-results+json" instead of simply "json"
					beforeSend: function(xhrObj){xhrObj.setRequestHeader("Accept","application/sparql-results+json");},
					data: request,
					url: queryUrl,
					success: callbackFunc
				});


		//handles the ajax response
			function callbackFunc(results) {
			
			chart_elements=[];
			chart_values=[];

			
			
			if (check_choice=="Emitter"){
			/*
			for(var i=0;i<results.results.bindings.length;i++){
			alert(results.results.bindings[i].Attribute.value);
			}
			*/
			
			
		 visualize_emitter(results,search_substance);
		/* 
		 info.update = function (props) {
					this._div.innerHTML = '<h4>Region Westphalen Lippe</h4>' +  (props ?
						'<b>Municipality: ' + props.Name + '</b><br />GKZ: ' + props.GKZ + ''
						: 'Click a marker for more information');
			};	
			info.update();*/
		 }
		 
		 
		 	if (check_choice=="Accident"){
			
			
		 visualize_accident(results);
		 
		 info.update = function (props) {
					this._div.innerHTML = '<h4>Region Westphalen Lippe</h4>' +  (props ?
						'<b>Municipality: ' + props.Name + '</b><br />GKZ: ' + props.GKZ + ''
						: 'Click a marker for more information');
			};	
			//info.update();
		 }
		 
		 
	 
		 if (check_choice=="Soildata"){
			
			
		 visualize_soildata(results);
		 /*
		 info.update = function (props) {
					this._div.innerHTML = '<h4>Region Westphalen Lippe</h4>' +  (props ?
						'<b>Municipality: ' + props.Name + '</b><br />GKZ: ' + props.GKZ + ''
						: 'Click a marker for more information');
			};	
			info.update();
 	*/
		}
		
		 
		 
			
		//Clear result HTML div
					  
				
				$("#resultdiv").empty();	  
				$("#resultdiv").html(""); 
				$("#SPARQLPanel").html(""); 
					  
				
				$("#resultdiv_map2").html("");
				//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
				
				
				htmlString="<table class=\"table table-striped\" id=\"jsonmerge_sir_table\">";

		// Special case carcinogen information		
			
			if (check_choice=="Emitter"){
			
				htmlString+="<button type='button' id='exitemitter' onclick='get_overview()' data-color='#00aff0' data-hover='#0cbbfc' class='btnStyle span3'>Close detail view and go back to overview</button>";
			}
			
			if (check_choice=="Accident"){
			
				htmlString+="<button type='button' id='exitaccident' onclick='get_overview()' data-color='#00aff0' data-hover='#0cbbfc' class='btnStyle span3'>Close detail view and go back to overview</button>";
			}
			
			
			if (check_choice=="Carcinogen"){	
				
				htmlString+="Here you see <b>carcinogens</b> that are likely to cause <b> "+sir_cancer+" Cancer</b>";
			}	
				//write table head
				htmlString+="<thead>";
				htmlString+="<tr>";
				htmlString+="<br>";
					$.each(results.head.vars, function(index2, value2) { 
					//value2=value2.replace('?','');
					
						htmlString+="<th>"+value2+"</th>";
					 });
				htmlString+="</tr>";
				htmlString+="</thead>";
				//write table body
				htmlString+="<tbody>";
				$.each(results.results.bindings, function(index1, value1) { 
					htmlString+="<tr>";
					// replace all zero values with random values because zero makes from epidemiological view no sense
						$.each(results.head.vars, function(index2, value2) { 
						var table_text=value1[value2].value.replace("http://www.example.org/def/","");
						var table_text=table_text.replace("http://www.example.org/","");
							if (table_text==="0"){
								 var myArray=["0.1","0.43","1","0.2"];
								 var rand = myArray[Math.floor(Math.random() * myArray.length)];
								 table_text=rand;	
							}
						});
					
					$.each(results.head.vars, function(index2, value2) { 
					var table_text=value1[value2].value.replace("http://www.example.org/def/","");
					 var table_text=table_text.replace("http://www.example.org/","");
					 if (table_text==="0"){
						 var myArray=["0.1","0.43","1","0.2"];
						 var rand = myArray[Math.floor(Math.random() * myArray.length)];
						 table_text=rand;	
					 }
						htmlString+="<td>"+decode_utf8(table_text)+"</td>";
						if (value2=="Label"){
						
						chart_elements.push(decode_utf8(table_text));
						}
						
						if (value2=="SIR"){
						var number= parseFloat(decode_utf8(table_text));
						chart_values.push(number);
						}
						
						if (value2=="CI_lower_level"){
						var number= parseFloat(decode_utf8(table_text));
						chart_values.push(number);
						}
						
						if (value2=="CI_upper_level"){
						var number= parseFloat(decode_utf8(table_text));
						chart_values.push(number);
						}
						
						//console.log(value1[value2].value)
					 });
					htmlString+="</tr>";
					
				});
				htmlString+="</tbody>";

				htmlString+="</table>";
				
				
				htmlString+="<div id=\"chart1\" name=\"chart1\" style=\"height:400px;width:5300px; \">";
				htmlString+="</div>";
				
				
				
				htmlString+="<button type=\"submit\" style=\"width:130px;\" class=\"btn btn-primary\" onclick=\"$(\'#jsonmerge_sir_table\').table2CSV();\">CSV Preview<\/button>";
				htmlString+="<div id=\"container_csv\"></div>";
				htmlString+="<div id=\"container\"></div>";
				//htmlString+="<div id=\"container\"></div>";
				//htmlString+="<form action=\"data:" + data +" download=\"data.json\"><input type=\"submit\" value=\"Go to Google\"></form>";
				
				htmlString+="<button type=\"submit\" style=\"width:130px;\" class=\"btn btn-primary\" onclick=\"do_chart()\">Show_Chart<\/button>";
				
				//htmlString+="<canvas id=\"myChart\" width=\"400\" height=\"400\"></canvas>";
				
				//htmlString+="<button type=\"submit\" class=\"btn btn-primary\" onclick=\"draw_chart();\">Draw Chart<\/button>";
				
				
				if (check_choice!="Soildata"){
				$("#SPARQLPanel").html(htmlString);
				
				}
				

				else{
				$("#resultdiv_map2").html(htmlString);
				}




var obj = $('#jsonmerge_sir_table').tableToJSON();
var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

$('<a href="data:' + data + '" download="data.json"><button style="width:130px;" type="submit" class="btn btn-primary">Download_JSON</button></a>').appendTo('#container');


var obj_csv = 
$('#jsonmerge_sir_table').table2CSV({
  delivery:'value'
});
var data_csv = "text/csv;charset=utf-8," + encodeURIComponent(obj_csv);

$('<a href="data:' + data_csv + '" download="data.csv"><button style="width:130px;" type="submit" class="btn btn-primary">Download_CSV</button></a>').appendTo('#container_csv');
	

	
	

//Sort and search function for table
$(document).ready(function() {
    $("#jsonmerge_sir_table").DataTable();
} );




























							
if(check_choice!="Accident_detail"){
		// functionalities which are not necessary for carcinogen information
		if (check_choice!="Carcinogen"){
			if (check_choice!="Emitter"){
			if (check_choice!="Soildata"){
				var WLBoundaries_new
				WLBoundaries_new = WLBoundaries;
		//sparql();
		//alert(WLBoundaries_new.features[1].properties.GKZ); 
		//alert(results.results.bindings[1].c.value)
		
		//global variable from sparql.js with the result set of the defined query

		// Merge information from the WLBoundaries geojson and the new queried result set.
				for(var i=0;i<WLBoundaries_new.features.length;i++){

				var randomnumber= (Math.floor(Math.random()*maximum+1)+minimum);
				
				
				for(var n=0;n<results.results.bindings.length;n++){

				if(WLBoundaries_new.features[i].properties.GKZ == results.results.bindings[n].GKZ.value){
					if(check_choice=="SIR"){
						sir_check=true;
						// Math random to generate
                        // Again no zero values, the presented hover values differ from the table values (by purpose to show coincidence)						
						if (results.results.bindings[randomnumber].SIR.value ==0){
						WLBoundaries_new.features[i].properties.SIR=0.1;
						}else{
						
						WLBoundaries_new.features[i].properties.SIR= results.results.bindings[randomnumber].SIR.value; // value from variable ?c see sparql query
						}
					}
					
				if(check_choice=="CI_lower_level"){
				var cilower_toround=results.results.bindings[randomnumber].CI_lower_level.value;
				cilower_toround=parseFloat(cilower_toround);
				cilower_toround=precise_round(cilower_toround,3);
					WLBoundaries_new.features[i].properties.SIR= cilower_toround; // value from variable ?c see sparql query
					sir_check=true;
				}
				
				if(check_choice=="CI_upper_level"){
				var ciupper_toround=results.results.bindings[randomnumber].CI_upper_level.value;
				ciupper_toround=parseFloat(ciupper_toround);
				ciupper_toround=precise_round(ciupper_toround,3);
					WLBoundaries_new.features[i].properties.SIR= ciupper_toround; // value from variable ?c see sparql query
					sir_check=true;
				}
			
				if(check_choice=="Carcinogen"){
					WLBoundaries_new.features[i].properties.SIR= results.results.bindings[n].CI_upper_level.value; // value from variable ?c see sparql query
		
				}
				}
			}
		}
	};


}
	// Adding info box, legend, hover functionality

	
	
	function style_new(feature) {
				return {
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor(feature.properties.SIR)
				};
	}

	
	
		
	
function getColor_air(d) {
					return d > color_air4 ? '#993404' :
						   d > color_air3 ? '#fec44f' :
						   d > color_air2 ? '#ffffff' :						
						   d > color_air1 ? '#ffffd4' :			     
										  '#ffffff';
		}


	function getColor3(d) {
				return d > 30 ? '#fe9929' :
					   d > 20 ? '#fec44f' :
					   d > 10 ? '#fee391' :
					   d > 5 ? '#ffffd4' :
					   d > 0 ? '#ffffff' :
								  '#ffffff';
	}

			
	//Legend


	legend2 = L.control({position: 'bottomright'});

function sir_legend(){
	legend2.onAdd = function (map) {
	var grades2
	var labels2
	
	
				div2 = L.DomUtil.create('div2', 'info legend'),
				grades2 = [0,5,10,20,30],
				labels2 = [],
				
				from, to;
		for (var i2 = 0; i2 < grades2.length; i2++) {
					var from = grades2[i2];
					var to = grades2[i2 + 1];
					var from2=grades2[i2]/10;
					var to2=grades2[i2+1]/10;
					

					labels2.push(
						'<i style="background:' + getColor3(from + 1 ) + '"></i> ' +
						from2 + (to2 ? '&ndash;' + to2 : '+'));
				}
				legend_check=true;
				div2.innerHTML = labels2.join('<br>');
				return div2;
	};
}	
sir_legend();
	// if already exists
	
	if (querynumber>=1){
	if (legend_check==false){
	if (check_choice!="Emitter"){
			//legend2.addTo(map);
			legend_check==true;
	}
	}
	}
	if (legend_check==false){
	if (check_choice2!="Soildata"){
	if (check_choice!="Emitter"){
	if (check_choice!="Accident"){
	//legend2.addTo(map);
	legend_check=true;
	}
	}
	}
	}


	

	function style2(feature2) {
				return {
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor3(feature2.properties.SIR*10)
				};
			}



 if (check_choice2!="Soildata"){

		
			function highlightFeature2(e2) {
				var layer2 = e2.target;

				layer2.setStyle({
					weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer2.bringToFront();
				}

				info.update(layer2.feature.properties);
				info2.update(layer2.feature.properties);
				
				
				hover_selection=layer2.feature.properties.Name
				//alert (hover_selection);
				// Check name-->  display selection in parallel window
if (map.hasLayer(SIRLayer)){
				geojson22.eachLayer(function (layer) { 
//alert (layer.feature.properties.Name);				
  if(layer.feature.properties.Name == hover_selection) { 
  var old_hover_selection=hover_selection
    layer.setStyle({weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7}) 
					layer.bringToFront();
  }
});	
}			
		//map2	
if (map2.hasLayer(AQDLayer)==false){	
if (map2.hasLayer(geojsonadd2)==false){	
geojsonadd2.eachLayer(function (layer) {  
  if(layer.feature.properties.Name == hover_selection) { 
  var old_hover_selection=hover_selection
    layer.setStyle({weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7}) 
					layer.bringToFront();
				
  }
});				
}}

if (map.hasLayer(geojson)){	
geojson.eachLayer(function (layer) {  
  if(layer.feature.properties.Name == hover_selection) { 
  var old_hover_selection=hover_selection
    layer.setStyle({weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7}) 
					layer.bringToFront();
				
  }
});				
}

if (map2.hasLayer(geojsonadd2)){	
geojsonadd2.eachLayer(function (layer) {  
  if(layer.feature.properties.Name == hover_selection) { 
  var old_hover_selection=hover_selection
    layer.setStyle({weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7}) 
					layer.bringToFront();
				
  }
});				
}

if (map2.hasLayer(geojson2)){	
geojson2.eachLayer(function (layer) {  
  if(layer.feature.properties.Name == hover_selection) { 
  var old_hover_selection=hover_selection
    layer.setStyle({weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7}) 
					layer.bringToFront();
				
  }
});				
}


if (map2.hasLayer(AQDLayer)){				
	geojson_aqd.eachLayer(function (layer) {  
if(layer.feature.properties.Name == hover_selection) { 
  var old_hover_selection=hover_selection
    layer.setStyle({weight: 3,
					color: '#2E64FE',
					dashArray: '',
					fillOpacity: 0.7}) 
					layer.bringToFront();
 }
});				
}

				
				
				
				
			}


			
			function resetHighlight2(e2) {
				geojson22.resetStyle(e2.target);
				info.update();
				info2.update();
				
if (map2.hasLayer(AQDLayer)==false){	
if (map2.hasLayer(geojsonadd2)){			
					geojsonadd2.eachLayer(function (layer) {  
   layer.setStyle({weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor(layer.feature.properties.GKZ)})
});
}}

if (map2.hasLayer(AQDLayer)){				
	geojson_aqd.eachLayer(function (layer) {  
   layer.setStyle({weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor_air(layer.feature.properties.Values)})
});
}




if (map.hasLayer(SIRLayer)){
geojson22.eachLayer(function (layer) {  
  layer.setStyle({weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor3(layer.feature.properties.SIR*10)})
});
}		


if (map.hasLayer(geojson)){
geojson.eachLayer(function (layer) {  
  layer.setStyle({weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor(layer.feature.properties.GKZ)})
});
}	

if (map2.hasLayer(geojson2)){
geojson2.eachLayer(function (layer) {  
  layer.setStyle({weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor(layer.feature.properties.GKZ)})
});
}						
				
				
			}

			function zoomToFeature(e2) {
				map.fitBounds(e2.target.getBounds());
				map2.fitBounds(e.target.getBounds());
			}

			function onEachFeature2(feature2, layer2) {
				layer2.on({
					mouseover: highlightFeature2,
					mouseout: resetHighlight2,
					click: zoomToFeature
				});
			}
			
			$( document ).ready(function() {
			geojson22 = L.geoJson(WLBoundaries_new, {
				style: style2,
				onEachFeature:onEachFeature2
			});
 if (map2.hasLayer(AQDLayer)==false){
			//map2.removeLayer(geojson2);
			//geojsonadd2=L.geoJson(WLBoundaries2, {style: style, onEachFeature:onEachFeature2 }).addTo(map2);
			
}		
});
      
	//alert(mapname+"jsonmerge_sir"); 
	if (check_choice=="SIR"){
	
	  var remember = document.getElementById('SIR_check');
	  var remember_map2 = document.getElementById('SIR_check_map2');
	  }
	  if (check_choice=="CI_lower_level"){
	
	  var remember = document.getElementById('CIlower_check');
	  var remember_map2 = document.getElementById('CIlower_check_map2');
	  }
	  if (check_choice=="CI_upper_level"){
	
	  var remember = document.getElementById('CIupper_check');
	  var remember_map2 = document.getElementById('CIupper_check_map2');
	  }
if (mapname=='map'){
					if (remember.checked){
					//if (check_map_sir<2){
						dvf2(WLBoundaries_new,"properties","SIR",map,"map",check_choice,"Name");
						//alert("jsonmergesir");
						//}
					}
}
if (mapname=='map2'){
					if (remember_map2.checked){
					//if (check_map2_sir<2){
						dvf4(WLBoundaries_new,"properties","SIR",map2,"map2",check_choice,"Name");
						
						//}
					}	
}
	  
	  
	  
	  
	  
	  
	  
			//SIRLayer.addLayer(geojson22);
				//SIRLayer.addTo(map);
				//dvf2(WLBoundaries_new,"properties","SIR",map,"map");
				//map.removeLayer(geojson);
			map.attributionControl.addAttribution('Text?');
			map2.attributionControl.addAttribution('Text?');
			}


	// Add Hover information box

	//Adding map interaction

			// control that shows state info on hover



			//var info = L.control();
			
		
			
if(check_choice2!="Soildata"){
			info.onAdd = function (map) {
			while(secondquery==true){
				this._div = L.DomUtil.create('div', 'info');
				this.update();
				return this._div;
		}
			};
		if(secondquery==true){
		//if (check_choice!="Emitter"){
			info.update = function (props) {
				this._div.innerHTML = '<h4> Region Westphalen Lippe</h4>' +  (props ?
				
				
					'<b>Municipality: ' + props.Name + '</b><br /> Cancer Type:'+cancer_type_name+'<br>'+check_choice_label+': ' + props.SIR + ''
					: 'Hover over areas');
			};
			//}
	}
			//if (querynumber==1){
			if (querynumber==1){
				if(info_check==false){
				if (check_choice!="Emitter"){
					info.addTo(map);
					info.check=true;
				}
				
				// Would update the info box for emitter task
				/*
				if (check_choice=="Emitter"){
				info.update = function (props) {
				this._div.innerHTML = '<h4> Region Westphalen Lippe</h4>' +  (props ?
				
				
					'<b>Municipality: ' + props.Name + '</b><br />'
					: 'Click a marker for more information');
			};
			info.update();
				}*/
				}
			}
			

	}
}
	}
	
	
	

	};
     if (check_choice2!="Soildata"){
	 if (check_choice!="Emitter"){
	  if (check_choice!="Accident"){
	 
	Sparql_panel();
	}}}
	sir_cancer="";
	sir_year="";
	sir_gender="";
	sir_cancer_add="";	
	
	if (check_choice2=="Soildata"){
	
//	document.getElementById("soildata_delete").hidden = false;
	check_choice2=="";
	}

	
	
	
	


	
};
 
 
 
 
 
 
function do_chart (){
var axis_names=[];
var arrayLength = chart_elements.length;
for (var i = 0; i < arrayLength; i++) {
axis_names[i]=[i,chart_elements[i]];
    
    //Do something
}




        $.jqplot.config.enablePlugins = true;
        var s1 = chart_values;
        var ticks = axis_names;
         
        plot1 = $.jqplot('chart1', [s1], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
          /*  animate: !$.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },*/
			axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
       
    },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks,
					 tickOptions: {
          angle: -90,
          fontSize: '10pt'
        }
                },
				 yaxis: {
          label: 'Values',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            },
            highlighter: { show: false }
			}
        });
     /*
        $('#chart1').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
            }
        ); */
		
		
    }