export async function searchPlace(query, locationsCount, center) {
    const { Place } = await window.google.maps.importLibrary("places");
    const request = {
        textQuery: query,
        fields: ["displayName", "location", "businessStatus", "priceLevel", "addressComponents"],
        locationBias: center,
        language: "en-US",
        region: "us",
        useStrictTypeFiltering: false,
    };
    //@ts-ignore
    const { places } = await Place.searchByText(request);

    if (places.length > 0) {
        return places.slice(0, locationsCount + 1);
    }
}

export async function getLocalCity(lat, lng) {
    const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
    const request = {
        // required parameters
        fields: ["displayName", "location", "addressComponents"],
        locationRestriction: {
            center: { lat, lng },
            radius: 5000,
        },
        maxResultCount: 1,
        rankPreference: SearchNearbyRankPreference.DISTANCE,
    };
    //@ts-ignore
    const { places } = await Place.searchNearby(request);
    return places?.[0]?.Fg?.addressComponents?.filter(component => component.types.includes("locality"))?.[0]?.longText;
}

export async function reverseGeocode(location) {
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ location }).catch((e) => console.log("Geocoder failed due to: " + e));
    if (response.results[0]) {
        return response.results[0].address_components?.filter(component => component.types.includes('locality'))?.[0]?.long_name;
    }
    return "";
}