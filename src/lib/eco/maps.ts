// Carga perezosa del script de Google Maps JS + Places
export async function loadGoogleMaps(): Promise<typeof google | null> {
    if (typeof window === "undefined") return null;
    if ((window as any).google?.maps?.places) return (window as any).google;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.warn("Falta NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
        return null;
    }

    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es`;
    await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = url;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("No se pudo cargar Google Maps"));
        document.head.appendChild(s);
    });

    return (window as any).google ?? null;
}

export type ParsedAddress = {
    calle: string; numero: string; pisoDepto?: string;
    codigoPostal: string; ciudad: string; provincia: string; pais: string;
    placeId?: string;
};

// Extrae componentes del PlaceResult a tus campos
export function parsePlace(place: google.maps.places.PlaceResult): ParsedAddress {
    const comp = place.address_components ?? [];
    const byType = (t: string) => comp.find(c => c.types.includes(t))?.long_name ?? "";

    const streetNumber = byType("street_number");
    const route = byType("route");
    const locality = byType("locality") || byType("postal_town") || byType("sublocality") || "";
    const admin1 = byType("administrative_area_level_1");
    const country = byType("country");
    const postal = byType("postal_code") || "";

    return {
        calle: route || "",
        numero: streetNumber || "",
        codigoPostal: postal,
        ciudad: locality,
        provincia: admin1,
        pais: country,
        placeId: place.place_id || undefined,
    };
}
