import {LatLng} from 'leaflet';
import {Link} from '../common/link.model';

export interface Event {
  id: string;
  title: string;
  description: string;
  links?: Array<Link>;
  hasDetails: boolean;
  coordinates?: LatLng;
  address?: string;
  city?: string;
  date: Date;
  contacts: { email?: string; phone?: string };
  read: boolean;
}
