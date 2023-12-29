import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import arrow from "./assets/arrow.svg";
import background from "./assets/pattern-bg.png";
import MarkPosition from "./components/MarkPosition";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    //Ipify Fetch Data Function
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${
            import.meta.env.VITE_REACT_APP_API_KEY
          }&ipAddress=170.40.150.126`
        );
        const data = await res.json();
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  // Search Function
  const searchIp = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        import.meta.env.VITE_REACT_APP_API_KEY
      }&${
        checkIpAddress.test(ipAddress)
          ? `ipAdress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  //handleSubmit function;

  const handleSubmit = (e) => {
    e.preventDefault();
    searchIp();
    setIpAddress("");
  };

  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img src={background} alt="" className="w-full h-80 object-cover" />
        </div>
        <div className=" p-10">
          <h1 className="text-2xl text-center lg:text-5xl text-white font-bold mb-8">
            IP Location Tracker
          </h1>
          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex justify-center max-w-2xl mx-auto"
          >
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any IP address or domain."
              required
              className="py-2 px-4 rounded-l-lg w-full focus:outline-none"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-black py-4 px-4 hover:opacity-70 rounded-r-lg"
            >
              <img src={arrow} alt="" />
            </button>
          </form>
        </div>
        {/* Ip Address Info */}
        {address && (
          <>
            <div
              className="bg-white rounded-lg shadow-lg p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left lg:text-left lg:-mb-16 relative"
              style={{ zIndex: 10000 }}
            >
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold tracking-wider text-slate-500 mb-3">
                  Ip Address
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.ip}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold tracking-wider text-slate-500 mb-3">
                  Location
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.location.city}, {address.location.region}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-bold tracking-wider text-slate-500 mb-3">
                  TimeZone
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  UTC {address.location.timezone}
                </p>
              </div>

              <div className="">
                <h2 className="uppercase text-sm font-bold tracking-wider text-slate-500 mb-3">
                  Isp
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.isp}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden">
              <MapContainer
                center={[address.location.lat, address.location.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100vh", width: "100vw" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkPosition address={address} />
              </MapContainer>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default App;
