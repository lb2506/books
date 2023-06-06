import React, { useEffect, useState } from "react";
import axios from 'axios';
import { url_api_librairie } from '../../api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import "./findLibrary.scss"

const FindLibrary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [librairies, setLibrairies] = useState([])
    const [filteredLibraries, setFilteredLibraries] = useState([])
    const [displayCount, setDisplayCount] = useState(10);
    const [filter, setFilter] = useState({
        designation: '',
        address: '',
        city: '',
    });
    const [radius, setRadius] = useState(); // Le rayon de recherche, en km
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        const fetchLib = async () => {
            setIsLoading(true);
            const response = await axios.get(`${url_api_librairie}/librairies`)
            setLibrairies(response.data)
            setFilteredLibraries(response.data)
            setIsLoading(false);
        };
        fetchLib();
    }, []);

    const applyFilters = () => {
        const newFilteredLibraries = librairies.filter(librairie =>
            librairie.Designation.toLowerCase().includes(filter.designation.toLowerCase()) &&
            librairie.Adresse.toLowerCase().includes(filter.address.toLowerCase()) &&
            librairie.Commune.toLowerCase().includes(filter.city.toLowerCase())
        );
        setFilteredLibraries(newFilteredLibraries);
    };

    const resetFilters = () => {
        setFilter({
            designation: '',
            address: '',
            city: '',
        });
        setFilteredLibraries(librairies);
    };

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + 10);
    }

    const loadLess = () => {
        setDisplayCount(prevCount => Math.max(10, prevCount - 10)); // Ne pas descendre en dessous de 10
    }

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                }
            );
        }
    }, []);

    const applyProximityFilter = () => {
        const haversineDistance = (location1, location2) => {
            const toRadian = angle => (Math.PI / 180) * angle;
            const R = 6371.01; // Rayon de la terre en km
            const { latitude: lat1, longitude: lon1 } = location1;
            const { latitude: lat2, longitude: lon2 } = location2;

            const dLat = toRadian(lat2 - lat1);
            const dLon = toRadian(lon2 - lon1);

            const a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) *
                Math.pow(Math.sin(dLon / 2), 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c;
        };

        const newFilteredLibraries = librairies.filter(librairie =>
            haversineDistance(userLocation, { latitude: librairie.Latitude, longitude: librairie.Longitude }) <= radius
        );

        setFilteredLibraries(newFilteredLibraries);
    };

    return (
        <div className="findLibrary">
            {isLoading ? (
                <p>Chargement des informations...</p>
            ) : (
                <>
                    <h1>Trouver une librairie</h1>
                    <div>
                        <h3>Filtrer par :</h3>
                        <input
                            placeholder='Désignation...'
                            value={filter.designation}
                            onChange={e => setFilter(prev => ({ ...prev, designation: e.target.value }))}
                        />
                        <input
                            placeholder='Adresse...'
                            value={filter.address}
                            onChange={e => setFilter(prev => ({ ...prev, address: e.target.value }))}
                        />
                        <input
                            placeholder='CP / Commune...'
                            value={filter.city}
                            onChange={e => setFilter(prev => ({ ...prev, city: e.target.value }))}
                        />
                        <button onClick={applyFilters}>Rechercher</button>
                        <button onClick={resetFilters}>Réinitialiser les filtres</button>
                    </div>
                    <div>
                        <h3>Rechercher autour de moi :</h3>
                        <input
                            placeholder='Rayon en km...'
                            value={radius}
                            onChange={e => setRadius(Number(e.target.value))}
                        />
                        <button onClick={applyProximityFilter}>Rechercher</button>
                    </div>
                    {/* Ajouter une carte Leaflet */}
                    <div>
                        <h3>Résultats de la recherche :</h3>
                        {userLocation.latitude && userLocation.longitude && (
                            <MapContainer center={userLocation} zoom={13} style={{ height: "100vh", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {filteredLibraries.slice(0, displayCount).map(librairie => (
                                    <Marker
                                        key={librairie.SIRET}
                                        position={{ lat: librairie.latitude, lng: librairie.longitude }}
                                    />
                                ))}
                            </MapContainer>
                        )}
                    </div>

                    {displayCount < filteredLibraries.length && (
                        <button onClick={loadMore}>Voir plus</button>
                    )}
                    {displayCount > 10 && (
                        <button onClick={loadLess}>Voir moins</button>
                    )}
                </>
            )}
        </div>
    )
}

export default FindLibrary;
