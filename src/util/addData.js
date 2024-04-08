import { addLocation } from '../api/firebase';
import { searchPlace } from '../api/google-maps';

export async function searchGoogle(data, center) {
    let result, error;

    const googleMapsData = await searchPlace(data.name, data.location.length, center);

    return googleMapsData.map(loc => loc.Fg);
}

export async function addData(data) {
    let result, error;

    result = await addLocation(data).catch(e => error = e);

    return { result, error };
}