import {MapContainer, Marker, Polyline, Popup, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import {useEffect} from "react";

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center]);
    return null;
}

export function RideMap({ pickup, dropoff, routeCoords }: {
    pickup: [number, number];
    dropoff: [number,number];
    routeCoords?: [number, number][];
}) {
    return (
        <MapContainer center={pickup} zoom={13} zoomControl={false} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {routeCoords && routeCoords.length > 0 && (
                <Polyline
                    positions={routeCoords}
                    color="#3b82f6"
                    weight={5}
                    opacity={0.8}
                />
            )}

            <Marker position = {pickup}>
                <Popup>Điểm đón</Popup>
            </Marker>
            <Marker position = {dropoff}>
                <Popup>Điểm đến</Popup>
            </Marker>
            <MapUpdater center={pickup}/>
        </MapContainer>
    );
}