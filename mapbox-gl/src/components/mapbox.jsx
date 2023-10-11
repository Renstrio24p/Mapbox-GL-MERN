import { useEffect, useState, lazy } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/app.css";
import axios from "axios";
import { format } from "timeago.js";
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));

const Popup = lazy(() =>
  import("react-map-gl").then((module) => ({ default: module.Popup }))
);
const NavigationControl = lazy(() =>
  import("react-map-gl").then((module) => ({
    default: module.NavigationControl,
  }))
);
const ReactMapGL = lazy(() =>
  import("react-map-gl").then((module) => ({ default: module.default }))
);
const Marker = lazy(() =>
  import("react-map-gl").then((module) => ({ default: module.Marker }))
);
const Star = lazy(() => import("@mui/icons-material/Star"));
const Room = lazy(() => import("@mui/icons-material/Room"));

export default function MapboxGL() {
  const mapbox_token = process.env.MAPBOX_TOKEN;
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(0);
  const [pins, setPins] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 120.984222,
    latitude: 14.599512,
    zoom: 6,
  });
  const [newPlaceViewState, setNewPlaceViewState] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log("The Error on: " + err);
      }
    };
    getPins();
  }, []);

  function handleMarkerClick(id, lat, long) {
    setCurrentPlaceId(id);
    setViewState({
      ...viewState,
      latitude: lat,
      longitude: long,
    });
  }

  function handleAddClick(e) {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat,
      long: lng,
    });

    setNewPlaceViewState({
      longitude: lng,
      latitude: lat,
      zoom: 12,
    });
  }

 async function handleSubmit(e) {
  e.preventDefault();
  const newPin = {
    username: currentUser,
    title,
    desc,
    rating,
    lat: newPlace.lat,
    long: newPlace.long,
  };

  try {
    const res = await axios.post("/api/pins", newPin, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    setPins([...pins, res.data]);
    setNewPlace(null);
  } catch (err) {
    console.log("error on : " + err);
  }
}

  return (
    <ReactMapGL
      mapboxAccessToken={mapbox_token}
      initialViewState={newPlaceViewState || viewState}
      style={{ width: "100vw", height: "100vh", animation: "fadeIn 3s 0s"}}
      mapStyle={"mapbox://styles/mapbox/satellite-streets-v11"}
      attributionControl={false}
      onDblClick={handleAddClick}
      transitionDuration={200}
    >
      
      {currentUser && (
        <NavigationControl style={{animation: "fadeInRight 3s 0s"}} />
      )}

      {pins.map((pin) => (
        <div key={`pin-${pin._id}`}>
          <Marker
            longitude={pin.long}
            latitude={pin.lat}
            anchor="bottom"
            offsetLeft={viewState.zoom * 1.5}
            offsetTop={viewState.zoom * 7}
          >
            <Room
              style={{
                color: pin.username === currentUser ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
            />
          </Marker>

          {pin._id === currentPlaceId && (
            <Popup
              latitude={pin.lat}
              longitude={pin.long}
              anchor="left"
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="card">
                <label htmlFor="place">Place</label>
                <h4 className="place">{pin.title}</h4>
                <label htmlFor="review">Review</label>
                <p>{pin.desc}</p>
                <label htmlFor="ratings">Ratings</label>
                <div className="stars">
                  {Array(pin.rating)
                    .fill(0)
                    .map((_, index) => (
                      <Star className="star" key={`star-${pin._id}-${index}`} />
                    ))}
                </div>
                <label htmlFor="info">Information</label>
                <span className="username">
                  Created by. <b>{pin.username}</b>
                </span>
                <span className="date">{format(pin.createdAt)}</span>
              </div>
            </Popup>
          )}
        </div>
      ))}
      {currentUser && newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="Enter a Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="review">Review</label>
              <textarea
                placeholder="say something about this place.."
                onChange={(e) => setDesc(e.target.value)}
              />
              <label htmlFor="rating">Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <input
                className="submitBtn"
                type="submit"
                placeholder="Add Pin"
                value="Add Pin"
              />
            </form>
          </div>
        </Popup>
      )}

      {/* Menu */}
      <div className="menu">
        {currentUser ? (
          <div className="auth-user">
            <Room />
            <span>Welcome {currentUser}</span>
            <button
              className="button logout"
              onClick={() => setCurrentUser(null)}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* Conditional rendering of Login and Register components */}
      {showRegister && (
        <Register
          setShowRegister={setShowRegister}
          setCurrentUser={setCurrentUser}
        />
      )}
      {showLogin && (
        <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} />
      )}
    </ReactMapGL>
  );
}
