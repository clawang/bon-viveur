export function getDistance(location1, location2) {
    const a = Math.abs(location1.lat - location2.lat);
    const b = Math.abs(location1.lng - location2.lng);
    return Math.sqrt( a*a + b*b );
}

export function getLatFromZoom(zoom) {
    return Math.exp((16-zoom)*Math.log(2)) * 500;
}