import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import {useEffect} from "react";

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

export function RideMap({ pickup, dropoff }: {
    pickup: [number, number];
    dropoff: [number,number];
}) {
    return (
        <MapContainer center={pickup} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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