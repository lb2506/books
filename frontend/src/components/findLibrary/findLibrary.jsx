import React, { useEffect, useState } from "react";
import axios from 'axios';
import { url_api_librairie } from '../../api';
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
    const [radius, setRadius] = useState(null); // Le rayon de recherche, en km
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [geoEnabled, setGeoEnabled] = useState(true);

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
                    if (error.code === 1) { // Code 1 indique que la permission a été refusée
                        setGeoEnabled(false);
                    }
                }
            );
        } else {
            setGeoEnabled(false); // Géolocalisation non prise en charge par le navigateur
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
            haversineDistance(userLocation, { latitude: librairie.latitude, longitude: librairie.longitude }) <= radius
        );

        setFilteredLibraries(newFilteredLibraries);
    };

    const resetProximityFilter = () => {
        setRadius(null);
        setFilteredLibraries(librairies);
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
                        <button onClick={resetFilters}>Réinitialiser</button>
                    </div>
                    <div>
                        <h3>Rechercher autour de moi :</h3>
                        <select
                            disabled={!geoEnabled}
                            title={geoEnabled ? "" : "Activez la géolocalisation pour utiliser cette fonctionnalité."}
                            value={radius}
                            onChange={e => setRadius(Number(e.target.value))}
                        >
                            <option value="">Sélectionnez un rayon...</option>
                            <option value="2">0-2km</option>
                            <option value="5">2-5km</option>
                            <option value="10">5-10km</option>
                            <option value="15">10-15km</option>
                            <option value="20">15-20km</option>
                            <option value="25">20-25km</option>
                            <option value="30">25-30km</option>
                        </select>
                        <button onClick={applyProximityFilter}>Rechercher</button>
                        <button onClick={resetProximityFilter}>Réinitialiser</button>
                    </div>
                    {filteredLibraries.slice(0, displayCount).map(librairie => (
                        <div key={librairie.SIRET} style={{ borderBottom: '1px solid black' }}>
                            <p>{librairie.Designation}, {librairie.Adresse}, {librairie.Commune}</p>
                        </div>
                    ))}
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
