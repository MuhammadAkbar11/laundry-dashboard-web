import React from 'react';
import { Card } from 'react-bootstrap';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import themeConfigs from '@configs/themeConfigs';

type Props = {};

const markers = [
  { latLng: [121.473701, 31.230391], name: 'Shanghai' },
  { latLng: [77.102493, 28.70406], name: 'Delhi' },
  { latLng: [3.379206, 6.524379], name: 'Lagos' },
  { latLng: [139.691711, 35.689487], name: 'Tokyo' },
  { latLng: [113.264381, 23.12911], name: 'Guangzhou' },
  { latLng: [-74.0059413, 40.7127837], name: 'New York' },
  { latLng: [-118.243683, 34.052235], name: 'Los Angeles' },
  { latLng: [-87.629799, 41.878113], name: 'Chicago' },
  { latLng: [-0.127758, 51.507351], name: 'London' },
  { latLng: [-3.70379, 40.416775], name: 'Madrid' },
];

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

function CardWorldMap({}: Props) {
  return (
    <Card className="card flex-fill w-100">
      <Card.Header>
        <Card.Title as="h5" className="card-title mb-0">
          Real-Time
        </Card.Title>
      </Card.Header>
      <Card.Body className="px-4">
        <div id="world_map" style={{ width: '100%', height: '100%' }}>
          <ComposableMap projection="geoMercator">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={themeConfigs['gray-300']}
                    stroke="#FFF"
                  />
                ))
              }
            </Geographies>
            {markers.map(({ name, latLng }) => (
              <Marker key={name} coordinates={latLng as [number, number]}>
                <circle
                  r={7}
                  fill={themeConfigs.primary}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardWorldMap;
