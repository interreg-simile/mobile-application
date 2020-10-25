import {Link} from '../common/link.model';

export interface Alert {
  id: string;
  title: string;
  content: string;
  links?: Array<Link>;
  dateEnd: Date;
  read: boolean;
  createdAt: Date;
}
