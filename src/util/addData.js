import { searchPlace } from '../api/google-maps';

export async function searchGoogle(data, center) {
    let result, error;

    const googleMapsData = await searchPlace(data.name, data.location.length, center);

    return googleMapsData.map(loc => loc.Fg);
}