import { useCallback, useMemo, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';

const DraggableMarker = (props) => {
  const [draggable, setDraggable] = useState(true);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const localization = marker.getLatLng();
          props.setLatitude(localization.lat);
          props.setLongitude(localization.lng);
        }
      },
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={{ lat: props.latitude, lng: props.longitude }}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
};

export default DraggableMarker;
