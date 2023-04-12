export const todayLine = {
    id: 'todayLine',
    beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
        ctx.setLineDash([6, 6]);
        ctx.moveTo(x.getPixelForValue(new Date()), top);
        ctx.lineTo(x.getPixelForValue(new Date()), bottom);
        ctx.stroke();
        ctx.restore();
    
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
        ctx.fillStyle = 'rgba(102, 102, 102, 1)';
        ctx.moveTo(x.getPixelForValue(new Date()), top + 3);
        ctx.lineTo(x.getPixelForValue(new Date()) - 6, top - 6);
        ctx.lineTo(x.getPixelForValue(new Date()) + 6, top - 6);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();

        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'rgba(102, 102, 102, 1)';
        ctx.textAlign = 'center';
        ctx.fillText('Сейчас', x.getPixelForValue(new Date()), bottom + 15);
        ctx.restore();
    }
}
  
export const assignedTasks = {
    id: 'assignedTasks',
    afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
        
        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        
        data.datasets[0].data.forEach((item, index) => {
            if(index % 2 === 1) { return; }
            ctx.fillText(item.name, 10, y.getPixelForValue(index / 2));
        });
        // console.log(data.datasets[0].data[0].name);
        ctx.fillText('Имена', 10, top - 15);
        ctx.restore();
    }
}
  
export const status = {
    id: 'status',
    beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
    
        const icons = ['\u2713', '\u23F3', '\u2717'];
        
        ctx.save();
        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        data.datasets[0].data.forEach((item, index) => {
            if(index % 2 === 1) { return; }
            ctx.fillText(icons[item.status], left - 120, y.getPixelForValue(index / 2));
        });
        ctx.fillText('Статус', left - 120, top - 15);
        ctx.restore();
    }
}

export const weekend = {
    id: 'weekend',
    beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
        ctx.save();

        x.ticks.forEach((tick, index) => {
            const day = new Date(tick.value).getDay();
            if(day === 6 || day === 0) {
                ctx.fillStyle = pluginOptions.weekendColor; //'rgba(102, 102, 102, 0.2)';
                ctx.fillRect(x.getPixelForValue(tick.value), top, 
                    x.getPixelForValue(new Date(tick.value).setHours(24)) - x.getPixelForValue(tick.value), height);
            }
        });
    }
}

export const progressBar = {
    id: 'progressBar',
    beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: { top, bottom, left, right, width, height }, 
            scales: { x, y } } = chart;

        ctx.save();

        const barHeight = height / y.ticks.length * data.datasets[0].barPercentage * data.datasets[0].categoryPercentage;

        data.datasets[0].data.forEach((item, index) => {
            ctx.beginPath();
            ctx.fillStyle = data.datasets[0].backgroundColor;
            ctx.fillRect(left, y.getPixelForValue(index) - (barHeight / 2), width / 2, barHeight);
        });
        
        
    }
}