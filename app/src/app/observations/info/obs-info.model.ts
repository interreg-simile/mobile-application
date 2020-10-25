interface Position {
  open?: boolean;
  type: string;
  coordinates: Array<number>;
  crs: { code: number; description: string };
  accuracy?: number;
  roi?: string;
}

interface Weather {
  open?: boolean;
  temperature?: number;
  sky: { code: number; description: string };
  wind?: number;
}

interface Details {
  open?: boolean;

  algae?: {
    open?: boolean;
    checked?: boolean;
    extension?: { code: number; description: string };
    look?: { code: number; description: string };
    colour?: { code: number; description: string };
    iridescent?: boolean;
  };

  foams?: {
    open?: boolean;
    checked?: boolean;
    extension?: { code: number; description: string };
    look?: { code: number; description: string };
    height?: { code: number; description: string };
  };

  oils?: {
    open?: boolean;
    checked?: boolean;
    extension?: { code: number; description: string };
    type?: { code: number; description: string };
  };

  litters?: {
    open?: boolean;
    checked?: boolean;
    quantity?: { code: number; description: string };
    type?: Array<{ code: number; description: string }>;
  };

  odours?: {
    open?: boolean;
    checked?: boolean;
    intensity?: { code: number; description: string };
    origin?: Array<{ code: number; description: string }>;
  };

  outlets?: {
    open?: boolean;
    checked?: boolean;
    inPlace?: boolean;
    terminal?: { code: number; description: string };
    colour?: { code: number; description: string };
    vapour?: boolean;
    signage?: boolean;
    signagePhoto?: string;
    prodActNearby?: boolean;
    prodActNearbyDetails?: string;
  };

  fauna?: {
    open?: boolean;
    checked?: boolean;
    fish?: {
      checked?: boolean;
      number?: number;
      deceased?: boolean;
      abnormal?: { checked?: boolean; details?: string };
      alien?: {
        checked?: boolean;
        species?: Array<{ code: number; description: string }>;
      };
    };
    birds?: {
      checked?: boolean;
      number?: number;
      deceased?: boolean;
      abnormal?: { checked?: boolean; details?: string };
      alien?: {
        checked?: boolean;
        species?: Array<{ code: number; description: string }>;
      };
    };
    molluscs?: {
      checked?: boolean;
      number?: number;
      deceased?: boolean;
      abnormal?: { checked?: boolean; details?: string };
      alien?: {
        checked?: boolean;
        species?: Array<{ code: number; description: string }>;
      };
    };
    crustaceans?: {
      checked?: boolean;
      number?: number;
      deceased?: boolean;
      abnormal?: { checked?: boolean; details?: string };
      alien?: {
        checked?: boolean;
        species?: Array<{ code: number; description: string }>;
      };
    };
    turtles?: {
      checked?: boolean;
      number?: number;
      deceased?: boolean;
      abnormal?: { checked?: boolean; details?: string };
      alien?: {
        checked?: boolean;
        species?: Array<{ code: number; description: string }>;
      };
    };
  };
}

interface Measures {
  open?: boolean;

  transparency?: {
    open?: boolean;
    val: number;
    instrument: {
      type: { code: number; description: string };
      precision?: number;
      details?: string;
    };
  };

  temperature?: {
    open?: boolean;
    multiple: boolean;
    val: Array<{ depth: number; val: number }>;
    instrument: {
      type: { code: number; description: string };
      precision?: number;
      details?: string;
    };
  };

  ph?: {
    open?: boolean;
    multiple: boolean;
    val: Array<{ depth: number; val: number }>;
    instrument: {
      type: { code: number; description: string };
      precision?: number;
      details?: string;
    };
  };

  oxygen?: {
    open?: boolean;
    multiple: boolean;
    percentage: boolean;
    val: Array<{ depth: number; val: number }>;
    instrument: {
      type: { code: number; description: string };
      precision?: number;
      details?: string;
    };
  };

  bacteria?: {
    open?: boolean;
    escherichiaColi?: number;
    enterococci?: number;
  };
}

export interface ObsInfo {
  uid: string;
  position: Position;
  weather: Weather;
  details?: Details;
  measures?: Measures;
  otherOpen?: boolean;
  other?: string;
  photos: Array<string>;
  createdAt: string;
  updatedAt: string;
}
