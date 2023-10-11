const MapboxGL = React.lazy(()=>import("./components/mapbox"))

export default function Start(){

  return(
    <div>
        <MapboxGL />
    </div>
  )

}