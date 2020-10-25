import {LatLng} from 'leaflet';

import {AlgaeComponent} from './details/algae/algae.component';
import {FoamsComponent} from './details/foams/foams.component';
import {OilsComponent} from './details/oils/oils.component';
import {LittersComponent} from './details/litters/litters.component';
import {OdoursComponent} from './details/odours/odours.component';
import {OutletsComponent} from './details/outlets/outlets.component';
import {FaunaComponent} from './details/fauna/fauna.component';
import {TransparencyComponent} from './measures/transparency/transparency.component';
import {TemperatureComponent} from './measures/temperature/temperature.component';
import {PhComponent} from './measures/ph/ph.component';
import {OxygenComponent} from './measures/oxygen/oxygen.component';
import {BacteriaComponent} from './measures/bacteria/bacteria.component';

export interface Position {
  coordinates: LatLng;
  accuracy: number;
  roi?: string;
}

export interface Weather {
  temperature: number;
  sky: { code: number };
  wind: number;
}

export interface Algae {
  checked: boolean;
  component: object;
  extension: { code: number };
  colour: { code: number };
  iridescent: boolean;
  look: { code: number };
}

export interface Foams {
  checked: boolean;
  component: object;
  extension: { code: number };
  look: { code: number };
  height: { code: number };
}

export interface Oils {
  checked: boolean;
  component: object;
  extension: { code: number };
  type: { code: number };
}

export interface Litters {
  checked: boolean;
  component: object;
  quantity: { code: number };
  type: any[];
}

export interface Odours {
  checked: boolean;
  component: object;
  intensity: { code: number };
  origin: any[];
}

export interface Outlets {
  checked: boolean;
  component: object;
  inPlace: boolean;
  terminal: { code: number };
  colour: { code: number };
  vapour: boolean;
  signage: boolean;
  signagePhoto: string;
  prodActNearby: boolean;
  prodActNearbyDetails: string;
}

export interface Fauna {
  checked: boolean;
  component: object;
  fish: {
    checked: boolean;
    number: number;
    deceased: boolean;
    abnormal: { checked: boolean; details: string };
    alien: { checked: boolean; species: any[] };
  };
  birds: {
    checked: boolean;
    number: number;
    deceased: boolean;
    abnormal: { checked: boolean; details: string };
    alien: { checked: boolean; species: any[] };
  };
  molluscs: {
    checked: boolean;
    number: number;
    deceased: boolean;
    abnormal: { checked: boolean; details: string };
    alien: { checked: boolean; species: any[] };
  };
  crustaceans: {
    checked: boolean;
    number: number;
    deceased: boolean;
    abnormal: { checked: boolean; details: string };
    alien: { checked: boolean; species: any[] };
  };
  turtles: {
    checked: boolean;
    number: number;
    deceased: boolean;
    abnormal: { checked: boolean; details: string };
    alien: { checked: boolean; species: any[] };
  };
}

export interface Details {
  algae: Algae;
  foams: Foams;
  oils: Oils;
  litters: Litters;
  odours: Odours;
  outlets: Outlets;
  fauna: Fauna;
}

export interface Instrument {
  type: { code: number };
  brand: string;
  precision: number;
  details: string;
}

export interface Transparency {
  checked: boolean;
  component: object;
  val: number;
  instrument: Instrument;
}

export interface Temperature {
  checked: boolean;
  component: object;
  multiple: boolean;
  val: any[];
  instrument: Instrument;
}

export interface Ph {
  checked: boolean;
  component: object;
  multiple: boolean;
  val: any[];
  instrument: Instrument;
}

export interface Oxygen {
  checked: boolean;
  component: object;
  multiple: boolean;
  percentage: boolean;
  val: any[];
  instrument: Instrument;
}

export interface Bacteria {
  checked: boolean;
  component: object;
  escherichiaColi: number;
  enterococci: number;
}

export interface Measures {
  checked: boolean;
  transparency: Transparency;
  temperature: Temperature;
  ph: Ph;
  oxygen: Oxygen;
  bacteria: Bacteria;
}

export class MeasuresImpl implements Measures {
  checked: boolean;
  transparency: Transparency;
  temperature: Temperature;
  ph: Ph;
  oxygen: Oxygen;
  bacteria: Bacteria;

  constructor() {
    this.checked = false;

    this.transparency = {
      checked: false,
      component: TransparencyComponent,
      val: undefined,
      instrument: {
        type: {code: undefined},
        brand: undefined,
        precision: undefined,
        details: undefined,
      },
    };

    this.temperature = {
      checked: false,
      component: TemperatureComponent,
      multiple: undefined,
      val: [],
      instrument: {
        type: {code: undefined},
        brand: undefined,
        precision: undefined,
        details: undefined,
      },
    };

    this.ph = {
      checked: false,
      component: PhComponent,
      multiple: undefined,
      val: [],
      instrument: {
        type: {code: undefined},
        brand: undefined,
        precision: undefined,
        details: undefined,
      },
    };

    this.oxygen = {
      checked: false,
      component: OxygenComponent,
      multiple: undefined,
      percentage: undefined,
      val: [],
      instrument: {
        type: {code: undefined},
        brand: undefined,
        precision: undefined,
        details: undefined,
      },
    };

    this.bacteria = {
      checked: false,
      component: BacteriaComponent,
      escherichiaColi: undefined,
      enterococci: undefined,
    };
  }
}

export class Observation {
  id: string;

  createdAt: Date;

  // uid: string;

  position: Position;

  weather: Weather;

  details: Details;

  measures: Measures;

  other: string;

  photos: Array<string>;

  constructor(coords: LatLng, accuracy: number) {
    this.position = {
      coordinates: coords,
      accuracy,
    };

    this.weather = {
      temperature: undefined,
      sky: {code: 1},
      wind: undefined,
    };

    this.photos = [undefined, undefined, undefined];

    const algae: Algae = {
      checked: false,
      component: AlgaeComponent,
      extension: {code: undefined},
      look: {code: undefined},
      colour: {code: undefined},
      iridescent: undefined,
    };

    const foams: Foams = {
      checked: false,
      component: FoamsComponent,
      extension: {code: undefined},
      look: {code: undefined},
      height: {code: undefined},
    };

    const oils: Oils = {
      checked: false,
      component: OilsComponent,
      extension: {code: undefined},
      type: {code: undefined},
    };

    const litters: Litters = {
      checked: false,
      component: LittersComponent,
      quantity: {code: undefined},
      type: [],
    };

    const odours: Odours = {
      checked: false,
      component: OdoursComponent,
      intensity: {code: undefined},
      origin: [],
    };

    const outlets: Outlets = {
      checked: false,
      component: OutletsComponent,
      inPlace: undefined,
      terminal: {code: undefined},
      colour: {code: undefined},
      vapour: undefined,
      signage: undefined,
      signagePhoto: undefined,
      prodActNearby: undefined,
      prodActNearbyDetails: undefined,
    };

    const fauna: Fauna = {
      checked: false,
      component: FaunaComponent,
      fish: {
        checked: undefined,
        number: undefined,
        deceased: undefined,
        abnormal: {checked: undefined, details: undefined},
        alien: {checked: undefined, species: []},
      },
      birds: {
        checked: undefined,
        number: undefined,
        deceased: undefined,
        abnormal: {checked: undefined, details: undefined},
        alien: {checked: undefined, species: []},
      },
      molluscs: {
        checked: undefined,
        number: undefined,
        deceased: undefined,
        abnormal: {checked: undefined, details: undefined},
        alien: {checked: undefined, species: []},
      },
      crustaceans: {
        checked: undefined,
        number: undefined,
        deceased: undefined,
        abnormal: {checked: undefined, details: undefined},
        alien: {checked: undefined, species: []},
      },
      turtles: {
        checked: undefined,
        number: undefined,
        deceased: undefined,
        abnormal: {checked: undefined, details: undefined},
        alien: {checked: undefined, species: []},
      },
    };

    this.details = {
      algae,
      foams,
      oils,
      litters,
      odours,
      outlets,
      fauna,
    };
  }
}
