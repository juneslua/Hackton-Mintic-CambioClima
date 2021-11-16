var compuesto = {
    clase : '.comp2',
    nodes : [
        {name: "0", x:200, y:200, r:30,  tag: "C", cl: "c2"},   
        {name: "1", x:100, y:150, r:15,   tag: "H", cl: "c2"},
        {name: "2", x:300, y:150, r:15,  tag: "H", cl: "c2"},
        {name: "3", x:100, y:250, r:15,  tag: "H", cl: "c2"},
        {name: "4", x:300, y:250, r:15,   tag: "H", cl: "c2"},
    ],
    edges : [
        {source: 0, target: 1},
        {source: 0, target: 2},
        {source: 0, target: 3},
        {source: 0, target: 4},
    ],

    crearC : function() {
        //svg element
        aux = this.clase[1]+this.clase.slice(5);
        var w = 400;
        var h = 400;
        var svg = d3.select(this.clase).append('svg')
            .attr('width','400px')
            .attr('height','400px');


        //linking data to circles and lines (nodes and edges)
        var lineas = [];
        for (var i=0; i < this.edges.length; i++){
            objeto = {source: this.nodes[this.edges[i].source], target: this.nodes[this.edges[i].target]};
            lineas.push(objeto);
        }

        var edge = svg.selectAll("line")
            .data(lineas)
            .enter()
            .append("line")
            .attr("id",function(d, i) {return 'edge'+i+aux})
            .attr('marker-end','url(#circle)')
            .attr("x1", function(d) {return d.source.x})
            .attr("y1", function(d) {return d.source.y})
            .attr("x2", function(d) {return d.target.x})
            .attr("y2", function(d) {return d.target.y})
            .style("stroke", "rgb(255,255,255)")
            .style("stroke-opacity", "0.4")
            .style("pointer-events", "none");
        
        var node = svg.selectAll("circle")
        .data(this.nodes)
            .enter()
            .append("circle")
            .attr("id", function(d,i) {return 'circle'+i+aux})
            .attr("r", function(d){return d.r})
            .attr("cx", function(d){return d.x})
            .attr("cy", function(d){return d.y})
            .attr("fill", "rgb(255,2255,255)")
            .attr("fill-opacity", "1")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        function linked (index) {
            b = [[],[],[]]
            for (var z=0; z < lineas.length; z++){
                if(lineas[z].source.name == index || lineas[z].target.name==index){
                    b[2].push('#edge' + z + lineas[z].source.cl);
                    var origin = '#circle' + lineas[z].source.name + lineas[z].source.cl;
                    var target = '#circle' + lineas[z].target.name + lineas[z].source.cl;
        
                    if(!b[0].includes(origin)){
                        b[0].push(origin);
                    }
                    if(!b[1].includes(target)){
                        b[1].push(target);
                    }
                }
            }
            return b;
        }
            
        function handleMouseOver(d, i) {
            links = linked(i);
            for(var z=0; z < links[2].length; z++){
                d3.select(links[2][z]).transition().duration(600).style("stroke","rgb(236,37,37)").style("stroke-opacity","0.9").style("stroke-width", 7);
            }

            for(var z=0; z < links[0].length; z++){
                let circle = links[0][z]; 
                let ncircle = circle.slice(7);
                d3.select(circle).transition().duration(600)
                    .attr("r", function(d){return d.r + 30}).attr("fill","rgba(70,130,180)").attr("fill-opacity", "1").style('z-index','10');
                d3.select(".label"+ncircle).transition().duration(900)
                    .style("display","block");
            }
            for(var z=0; z < links[1].length; z++){
                let circle = links[1][z];
                let ncircle = circle.slice(7);              
                d3.select(circle).transition().duration(600)
                    .attr("r", function(d) {return d.r +15}).attr("fill","rgb(65,10,255)").attr("fill-opacity","0.9");
                d3.select(".label"+ncircle).transition().duration(900)
                    .style("display","block");
            }
        }
        
        function handleMouseOut(d, i){
            links = linked(i);
            for(var z = 0; z < links[2].length; z++){
                d3.select(links[2][z]).transition().duration(600).style("stroke", "rgb(255,255,255)").style("stroke-opacity", "0.4").style("stroke-width", 1);
            }
            for(var z = 0; z < links[0].length; z++){   
                let circle = links[0][z];
                let ncircle = circle.slice(7);
                d3.select(circle).transition().duration(900)
                    .attr("r", function(d) { return d.r }).attr("fill","rgb(255,255,255)").attr("fill-opacity", "1");
                d3.select(".label"+ncircle).transition().duration(900)
                    .style("display","none");
            }
            for(var z = 0; z < links[1].length; z++){
                let circle = links[1][z];
                let ncircle = circle.slice(7);
                d3.select(links[1][z]).transition().duration(900)
                    .attr("r", function(d) { return d.r }).attr("fill","rgb(255,255,255)").attr("fill-opacity", "1");          
                d3.select(".label"+ncircle).transition().duration(900)
                    .style("display","none");
            }  
        }
        
        for (var i=0; i<this.nodes.length; i++){
            d3.select(this.clase).append("div").attr("class", "node_names label" + i +this.nodes[i].cl).style("left", (this.nodes[i].x-15) + "px").style("top", (this.nodes[i].y-35) + "px").html(this.nodes[i].tag);
        } 
    }
}

var prueba = Object.create(compuesto);
prueba.crearC();
var no2 = Object.create(compuesto);
no2.clase = '.comp3';
no2.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "O", cl:"c3"},   
    {name: "1", x:100, y:150, r:15,   tag: "N", cl: "c3"},
    {name: "2", x:300, y:150, r:15,  tag: "N", cl: "c3"},
];
no2.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
no2.crearC();

var co2 = Object.create(compuesto);
co2.clase = '.comp1';
co2.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl:"c1"},   
    {name: "1", x:100, y:250, r:15,   tag: "O", cl: "c1"},
    {name: "2", x:300, y:250, r:15,  tag: "O", cl: "c1"},
];
co2.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
co2.crearC();

var no2E = Object.create(compuesto);
no2E.clase = '.comp6';
no2E.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "O", cl:"c6"},   
    {name: "1", x:100, y:150, r:15,   tag: "N", cl: "c6"},
    {name: "2", x:300, y:150, r:15,  tag: "N", cl: "c6"},
];
no2E.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
no2E.crearC();

var co2E = Object.create(compuesto);
co2E.clase = '.comp4';
co2E.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl:"c4"},   
    {name: "1", x:100, y:250, r:15,   tag: "O", cl: "c4"},
    {name: "2", x:300, y:250, r:15,  tag: "O", cl: "c4"},
];
co2E.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
co2E.crearC();

var ch4E = Object.create(compuesto);
ch4E.clase = '.comp5';
ch4E.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl: "c5"},   
    {name: "1", x:100, y:150, r:15,   tag: "H", cl: "c5"},
    {name: "2", x:300, y:150, r:15,  tag: "H", cl: "c5"},
    {name: "3", x:100, y:250, r:15,  tag: "H", cl: "c5"},
    {name: "4", x:300, y:250, r:15,   tag: "H", cl: "c5"},
];
ch4E.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
    {source: 0, target: 3},
    {source: 0, target: 4},
];
ch4E.crearC();

var co2I = Object.create(compuesto);
co2I.clase = '.comp7';
co2I.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl:"c7"},   
    {name: "1", x:100, y:250, r:15,   tag: "O", cl: "c7"},
    {name: "2", x:300, y:250, r:15,  tag: "O", cl: "c7"},
];
co2I.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
co2I.crearC();

var ch4I = Object.create(compuesto);
ch4I.clase = '.comp9';
ch4I.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl: "c9"},   
    {name: "1", x:100, y:150, r:15,   tag: "H", cl: "c9"},
    {name: "2", x:300, y:150, r:15,  tag: "H", cl: "c9"},
    {name: "3", x:100, y:250, r:15,  tag: "H", cl: "c9"},
    {name: "4", x:300, y:250, r:15,   tag: "H", cl: "c9"},
];
ch4I.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
    {source: 0, target: 3},
    {source: 0, target: 4},
];
ch4I.crearC();

var no2I = Object.create(compuesto);
no2I.clase = '.comp8';
no2I.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "O", cl:"c8"},   
    {name: "1", x:100, y:150, r:15,   tag: "N", cl: "c8"},
    {name: "2", x:300, y:150, r:15,  tag: "N", cl: "c8"},
];
no2I.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
no2I.crearC();

var co2R = Object.create(compuesto);
co2R.clase = '.comp10';
co2R.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl:"c10"},   
    {name: "1", x:100, y:250, r:15,   tag: "O", cl: "c10"},
    {name: "2", x:300, y:250, r:15,  tag: "O", cl: "c10"},
];
co2R.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
co2R.crearC();

var ch4R = Object.create(compuesto);
ch4R.clase = '.comp11';
ch4R.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "C", cl: "c11"},   
    {name: "1", x:100, y:150, r:15,   tag: "H", cl: "c11"},
    {name: "2", x:300, y:150, r:15,  tag: "H", cl: "c11"},
    {name: "3", x:100, y:250, r:15,  tag: "H", cl: "c11"},
    {name: "4", x:300, y:250, r:15,   tag: "H", cl: "c11"},
];
ch4R.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
    {source: 0, target: 3},
    {source: 0, target: 4},
];
ch4R.crearC();

var no2R = Object.create(compuesto);
no2R.clase = '.comp12';
no2R.nodes = [
    {name: "0", x:200, y:200, r:30,  tag: "O", cl:"c12"},   
    {name: "1", x:100, y:150, r:15,   tag: "N", cl: "c12"},
    {name: "2", x:300, y:150, r:15,  tag: "N", cl: "c12"},
];
no2R.edges = [
    {source: 0, target: 1},
    {source: 0, target: 2},
];
no2R.crearC();