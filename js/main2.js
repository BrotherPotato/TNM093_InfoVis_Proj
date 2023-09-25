queue()
    .defer(d3.csv, 'data/Clusters.csv')
    .await(draw);

var pc0, pc;

function draw(error, data) {
    if (error) throw error;

    pc0 = new pc0(data);
    pc = new pc(data);
}
