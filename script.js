const btn = document.querySelector(".btn")
const route = document.querySelector(".route");
const startDate = document.querySelector(".start-date")
const endDate = document.querySelector(".end-date")
const errMsg = document.querySelector(".err-msg")
const result = document.querySelector(".result")
const totDays = document.querySelector(".tot-days")
const tsPerDay=24 * 60 * 60 * 1000; //timestamp value per day
const routeMap = {
    Tirunelveli: {
        Madurai: 2
    },
    Madurai: {
        Tirunelveli: 2,
        Trichy: 2,
        Coimbatore: 3,
        Salem: 3,
    },
    Trichy: {
        Chennai: 3
    },
    Coimbatore: {
        Chennai: 3,
        Bangalore: 3
    },
    Salem: {
        Bangalore: 2
    },
    Bangalore: {
        Mumbai: 3
    },
    Chennai: {
        Bangalore: 2,
        Mumbai: 5
    },
    Mumbai: {}
};

//to remove weekends
const excludeWeekEnds = (ts, totdays) => {
 if (totdays===0) return ts;
 else
    {   let arr = [];
    let additionalDays = 0;
    for (i = 0; i <totdays; i++) {
        arr.push((ts + (i * tsPerDay)))
    }
    console.log(arr);
    arr.forEach((el) => {
        if (new Date(el).getDay() === 6) //if day is saturday(6)
        {
            additionalDays += 2;
            // console.log(additionalDays);
        }
    })
    if (new Date(arr[0]).getDay()===0)
    {  additionalDays += 1;
    }
    console.log(additionalDays);
    const newDay = ts + (((totdays-1) + additionalDays) * tsPerDay);
    console.log(new Date(newDay).toLocaleDateString())
    let finalDay = 0;

    if (new Date(newDay).getDay() === 6||new Date(newDay).getDay() === 0) finalDay = 2;
    console.log(finalDay)
    const newDestDay= ts + (((totdays-1) + additionalDays + finalDay) * tsPerDay)
    console.log(newDestDay);
    if (new Date(newDestDay).getDay() === 0) return newDestDay+(1*tsPerDay);
    if (new Date(newDestDay).getDay() === 6) return newDestDay+(2*tsPerDay);
    else return newDestDay;
}
}

const tracePath = (table, start, end) => {
    try {
        var path = [];
        var next = end;
        while (true) {
            path.unshift(next);
            if (next === start) {
                break;
            }
            next = table[next].travelTo;
        }

        return path;
    } catch (err) {
        errMsg.classList.remove('hidden');
    }
};

const formatRouteMap = (g) => {
    const tmp = {};
    Object.keys(g).forEach((k) => {
        const obj = g[k];
        const arr = [];
        Object.keys(obj).forEach((v) => arr.push({
            travelTo: v,
            travelDistance: obj[v]
        }));
        tmp[k] = arr;

    });
    console.log(tmp);
    return tmp;
};

const shortPath = (routeMap, start, end) => {
    var map = formatRouteMap(routeMap);
    var visited = [];
    var unvisited = [start];
    var shortestDistances = {
        [start]: {
            travelTo: start,
            travelDistance: 0
        }
    };

    var travelTo;
    while ((travelTo = unvisited.shift())) {
        // Explore unvisited neighbors
        var neighbors = map[travelTo].filter((n) => !visited.includes(n.travelTo));
        // Add neighbors to the unvisited list
        unvisited.push(...neighbors.map((n) => n.travelTo));

        var travelDistTotravelTo = shortestDistances[travelTo].travelDistance;
        for (let {
                travelTo: to,
                travelDistance
            } of neighbors) {
            var currTravelDistanceToNeighbor = shortestDistances[to] && shortestDistances[to].travelDistance;
            var newTravelDistanceToNeighbor = travelDistTotravelTo + travelDistance;
            if (
                currTravelDistanceToNeighbor == undefined ||
                newTravelDistanceToNeighbor < currTravelDistanceToNeighbor
            ) {
                // Update the table
                shortestDistances[to] = {
                    travelTo,
                    travelDistance: newTravelDistanceToNeighbor
                };
            }
        }

        visited.push(travelTo);
    }
    const startDateTs=new Date();
    const path = tracePath(shortestDistances, start, end);
    const totalDays = shortestDistances[end].travelDistance;
    const today = startDateTs.toLocaleDateString();
    const todayTS = startDateTs.getTime();
    const arrivalTS = excludeWeekEnds(todayTS, (totalDays));
    let arrivalDate;
    console.log(totalDays)
    if (totalDays == 0) {
        totDays.innerHTML = 'by Today'
        // arrivalDate = new Date(todayTS).toLocaleDateString();
    } else {
        totDays.innerHTML = ` in <b>${shortestDistances[end].travelDistance}</b> working days`;
    }
    arrivalDate = new Date(arrivalTS).toLocaleDateString();
    console.log(path.join(" -> "), " travel days ", shortestDistances[end].travelDistance);
    console.log(todayTS);


    result.classList.remove('hidden');
    route.innerHTML = `${path.join(`&emsp; <i class="fas fa-angle-double-right"></i> &emsp;`)}`
    startDate.innerHTML = today;
    endDate.innerHTML = arrivalDate;

};

btn.addEventListener('click', () => {
    result.classList.add('hidden');
    errMsg.classList.add('hidden')
    const from = document.querySelector(".from")
    const to = document.querySelector(".to")
    shortPath(routeMap, from.value, to.value);
})