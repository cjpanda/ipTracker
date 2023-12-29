import L from "leaflet";
import icon from "../assets/icon-location.svg";

const Icon = () => {
  return L.icon({
    iconSize: [32, 40],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: icon,
  });
};

export default Icon;
