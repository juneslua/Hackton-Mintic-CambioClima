var circulo = {    
    clase: '.d3CircleAgro',
    file: "http://localhost:3000/api/emisiones/pie/3",
    colores : ['#658C2A','#8CBF3F','#D9CD25','#F29D35','#CDF493','#AEF249','#607345','#8ABF39'],
    crear : function(){
        const width = 700,
        height = 700,
        maxRadius = (Math.min(width, height) / 2) - 5;

        const formatNumber = d3.format(',d');

        const x = d3.scaleLinear()
        .range([0, 2 * Math.PI])
        .clamp(true);

        const y = d3.scaleSqrt()
        .range([maxRadius*.1, maxRadius]);

        const color = d3.scaleOrdinal(this.colores);

        const partition = d3.partition();

        const arc = d3.arc()
        .startAngle(d => x(d.x0))
        .endAngle(d => x(d.x1))
        .innerRadius(d => Math.max(0, y(d.y0)))
        .outerRadius(d => Math.max(0, y(d.y1)));

        const middleArcLine = d => {
        const halfPi = Math.PI/2;
        const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

        const middleAngle = (angles[1] + angles[0]) / 2;
        const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
        if (invertDirection) { angles.reverse(); }

        const path = d3.path();
        path.arc(0, 0, r, angles[0], angles[1], invertDirection);
        return path.toString();
        };

        const textFits = d => {
        const CHAR_SPACE = 6;

        const deltaAngle = x(d.x1) - x(d.x0);
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
        const perimeter = r * deltaAngle;

        return d.data.name.length * CHAR_SPACE < perimeter;
        };

        const svg = d3.select(this.clase).append('svg')
        .style('width', '700px')
        .style('height', '700px')
        .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
        .on('click', () => focusOn()); // Reset zoom on canvas click


        d3.json(this.file, (error, root) => {
        if (error) throw error;

        root = d3.hierarchy(root);
        root.sum(d => d.value);

        const slice = svg.selectAll('g.slice')
            .data(partition(root).descendants());

        slice.exit().remove();

        const newSlice = slice.enter()
            .append('g').attr('class', 'slice')
            .on('click', d => {
                d3.event.stopPropagation();
                focusOn(d);
            });

        newSlice.append('title')
            .text(d => d.data.name + '\n' + formatNumber(d.value));

        newSlice.append('path')
            .attr('class', 'main-arc')
            .style('fill', d => color((d.children ? d : d.parent).data.name))
            .attr('d', arc);

        newSlice.append('path')
            .attr('class', 'hidden-arc')
            .attr('id', (_, i) => `hiddenArc${i}`)
            .attr('d', middleArcLine);

        const text = newSlice.append('text')
            .attr('display', d => textFits(d) ? null : 'none');

        // Add white contour
        text.append('textPath')
            .attr('startOffset','50%')
            .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
            .text(d => d.data.name)
            .style('fill', 'none')
            .style('stroke', '#fff')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round');

        text.append('textPath')
            .attr('startOffset','50%')
            .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
            .text(d => d.data.name);
        });

        function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
        // Reset to top-level if no data point specified

        const transition = svg.transition()
            .duration(750)
            .tween('scale', () => {
                const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]);
                return t => { x.domain(xd(t)); y.domain(yd(t)); };
            });

        transition.selectAll('path.main-arc')
            .attrTween('d', d => () => arc(d));

        transition.selectAll('path.hidden-arc')
            .attrTween('d', d => () => middleArcLine(d));

        transition.selectAll('text')
            .attrTween('display', d => () => textFits(d) ? null : 'none');

        moveStackToFront(d);

        //

        function moveStackToFront(elD) {
            svg.selectAll('.slice').filter(d => d === elD)
                .each(function(d) {
                    this.parentNode.appendChild(this);
                    if (d.parent) { moveStackToFront(d.parent); }
                })
        }
        }
        
    }
}
var circuloA = Object.create(circulo);
circuloA.crear();

var circuloB = Object.create(circulo);
circuloB.clase = '.d3CircleEnergia';
circuloB.file = "http://localhost:3000/api/emisiones/pie/1";
circuloB.colores = ['#D92332','#F2B807','#F2921D','#F27127','#F2CC0C','#BCD563','#FDD306','#DBAD14'];
circuloB.crear();

var circuloC = Object.create(circulo);
circuloC.clase = '.d3CircleIndustry';
circuloC.file = "http://localhost:3000/api/emisiones/pie/2";
circuloC.colores = ['#2B3A8C','#2B448C','#1B70A6','#05C7F2','#25A6D9','#05C7F2','#252359','#59544F'];
circuloC.crear();

var circuloD = Object.create(circulo);
circuloD.clase = '.d3CircleResiduos';
circuloD.file = "http://localhost:3000/api/emisiones/pie/4";
circuloD.colores = ['#D94F30','#9F7641','#D5A972','#D9896C','#BF712C','#C18029','#6C4E17','#724D15'];
circuloD.crear();
//circuloA.clase = '.d3CircleAgro';
//circuloA.file = 'https://gist.githubusercontent.com/bnsm98/fce729735309c23fc3fce8f1db58eb14/raw/886ea91750a80f710b271fe477a1b338b858b929/agro.json';
//cA = crearCircle('.d3CircleAgro','https://gist.githubusercontent.com/bnsm98/fce729735309c23fc3fce8f1db58eb14/raw/886ea91750a80f710b271fe477a1b338b858b929/agro.json');
//cE = crearCircle('.d3CircleEnergia','https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json');